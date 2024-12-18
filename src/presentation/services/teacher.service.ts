import { PrismaClient } from '@prisma/client';
import {
  TeacherDto,
  CustomError,
  PaginationDto,
  UserEntity,
  TeacherEntity,
  CustomSuccessful,
} from '@/domain';
import { bcryptAdapter } from '@/config';

const prisma = new PrismaClient();

export class TeacherService {
  constructor() {}
  // OBTENER TODOS LOS PROFESORES
  async getTeachers(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    try {
      const [total, teachers] = await Promise.all([
        prisma.teachers.count({ where: { state: true } }),
        prisma.teachers.findMany({
          where: {
            state: true,
          },
          skip: (page - 1) * limit,
          take: limit,
          include: {
            user: true,
          },
        }),
      ]);
      return CustomSuccessful.response({
        result: {
          page: page,
          limit: limit,
          total: total,
          next: `/api/teacher?page=${page + 1}&limit=${limit}`,
          prev:
            page - 1 > 0
              ? `/api/teacher?page=${page - 1}&limit=${limit}`
              : null,
          teachers: teachers.map((teacher) => {
            const { ...teacherEntity } = TeacherEntity.fromObject(teacher);
            return teacherEntity;
          }),
        },
      });
    } catch (error) {
      throw CustomError.internalServer('Internal Server Error');
    }
  }
  // CREAR PROFESOR
  async createTeacher(dto: TeacherDto, user: UserEntity) {
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
      if (user || contact) throw CustomError.badRequest('El docente ya existe');
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
      const teacher = await prisma.teachers.create({
        data: {
          userId: user.id,
        },
        include: {
          user: true,
        },
      });
      const { ...teacherEntity } = TeacherEntity.fromObject(teacher);
      return CustomSuccessful.response({ result: teacherEntity });
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }
  // EDITAR PROFESOR
  async updateTeacher(dto: TeacherDto, user: UserEntity, userId: number) {
    const teacherExists = await prisma.teachers.findFirst({
      where: { userId: userId },
      include: {
        user: true,
      },
    });
    if (!teacherExists) throw CustomError.badRequest('El docente no existe');

    try {
      await prisma.users.update({
        where: { id: teacherExists.userId },
        data: {
          ...dto,
          password: await bcryptAdapter.hash(teacherExists.user.password),
        },
      });

      const teacher = await prisma.teachers.update({
        where: { userId: userId },
        data: {
          // ...updateTeacherDto,
        },
        include: {
          user: true,
        },
      });

      const { ...teacherEntity } = TeacherEntity.fromObject(teacher);
      return CustomSuccessful.response({ result: teacherEntity });
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }
  // ELIMINAR PROFESOR
  async deleteTeacher(user: UserEntity, userId: number) {
    const teacherExists = await prisma.teachers.findFirst({
      where: { userId: userId },
    });
    if (!teacherExists) throw CustomError.badRequest('El docente no existe');
    try {
      await prisma.teachers.update({
        where: { userId: userId },
        data: {
          state: false,
        },
      });
      return CustomSuccessful.response({ message: 'Docente eliminado' });
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }
}
