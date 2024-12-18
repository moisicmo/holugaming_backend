import { PrismaClient } from '@prisma/client';
import {
  StudentDto,
  CustomError,
  PaginationDto,
  UserEntity,
  StudentEntity,
  CustomSuccessful,
} from '@/domain';
import { bcryptAdapter } from '@/config';

const prisma = new PrismaClient();

export class StudentService {
  constructor() {}

  // OBTENER TODOS LOS ESTUDIANTES
  async getStudents(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    try {
      const [total, students] = await Promise.all([
        prisma.students.count({ where: { state: true } }),
        prisma.students.findMany({
          where: {
            state: true,
          },
          skip: (page - 1) * limit,
          take: limit,
          include: {
            user: true,
            tutors: {
              include: {
                user: true,
              },
            },
          },
        }),
      ]);
      return CustomSuccessful.response({
        result: {
          page: page,
          limit: limit,
          total: total,
          next: `/api/student?page=${page + 1}&limit=${limit}`,
          prev:
            page - 1 > 0
              ? `/api/student?page=${page - 1}&limit=${limit}`
              : null,
          students: students.map((student) => {
            const { ...studentEntity } = StudentEntity.fromObject(student);
            return studentEntity;
          }),
        },
      });
    } catch (error) {
      throw CustomError.internalServer('Internal Server Error');
    }
  }

  // CREAR ESTUDIANTE
  async createStudent(dto: StudentDto, user: UserEntity) {
    try {
      let user = await prisma.users.findFirst({
        where: {
          numberDocument: dto.dni,
        },
      });
      const contact = await prisma.contacts.findFirst({
        where: {
          data: dto.data,
          typeContact: dto.typeContact,
        },
      });
      if (user || contact)
        throw CustomError.badRequest('El estudiante ya existe');
      // creamos al usuario
      user = await prisma.users.create({
        data: {
          numberDocument: dto.dni,
          name: dto.name,
          lastName: dto.lastName,
          password: await bcryptAdapter.hash(dto.data),
        },
      });
      // creamos el contacto
      await prisma.contacts.create({
        data: {
          userId: user.id,
          typeContact: dto.typeContact,
          data: dto.data,
        },
      });
      const student = await prisma.students.create({
        data: {
          userId: user.id,
          code: dto.dni??'',
          tutors: {
            connect: dto.tutors.map((userId) => ({ userId: userId })),
          },
        },
        include: {
          user: true,
          tutors: {
            include: {
              user: true,
            },
          },
        },
      });

      const { ...studentEntity } = StudentEntity.fromObject(student);
      return CustomSuccessful.response({ result: studentEntity });
    } catch (error) {
      console.log(error);
      throw CustomError.internalServer(`${error}`);
    }
  }
  // EDITAR ESTUDIANTE
  async updateStudent(dto: StudentDto, user: UserEntity, userId: number) {
    const studentExists = await prisma.students.findFirst({
      where: { userId: userId },
      include: {
        user: true,
      },
    });
    if (!studentExists) throw CustomError.badRequest('El estudiante no existe');

    try {
      await prisma.users.update({
        where: { id: studentExists.userId },
        data: {
          ...dto,
          password: await bcryptAdapter.hash(studentExists.user.password),
        },
      });

      const student = await prisma.students.update({
        where: { userId: userId },
        data: {
          // ...updateStudentDto,
          code: dto.dni,
        },
        include: {
          user: true,
        },
      });

      const { ...studentEntity } = StudentEntity.fromObject(student);
      return CustomSuccessful.response({ result: studentEntity });
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }
  // ELIMINAR ESTUDIANTE
  async deleteStudent(user: UserEntity, userId: number) {
    const studentExists = await prisma.students.findFirst({
      where: { userId: userId },
    });
    if (!studentExists) throw CustomError.badRequest('El estudiante no existe');
    try {
      await prisma.students.update({
        where: { userId: userId },
        data: {
          state: false,
        },
      });
      return CustomSuccessful.response({ message: 'Estudiante eliminado' });
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  async getStudent(userId: number) {
    try {
      const student = await prisma.students.findFirst({
        where: { userId: userId },
      });
      return CustomSuccessful.response({
        result: {
          student,
        },
      });
    } catch (error) {
      throw CustomError.internalServer('Internal Server Error');
    }
  }
}
