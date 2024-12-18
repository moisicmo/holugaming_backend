import { PrismaClient } from '@prisma/client';
import {
  TutorDto,
  CustomError,
  PaginationDto,
  UserEntity,
  TeacherEntity,
  CustomSuccessful,
  TutorEntity,
} from '@/domain';
import { bcryptAdapter } from '@/config';

const prisma = new PrismaClient();

export class TutorService {
  constructor() {}
  // OBTENER TODOS LOS TUTORES
  async getTutors(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    try {
      const [total, tutors] = await Promise.all([
        prisma.tutors.count({ where: { state: true } }),
        prisma.tutors.findMany({
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
          next: `/api/tutor?page=${page + 1}&limit=${limit}`,
          prev:
            page - 1 > 0 ? `/api/tutor?page=${page - 1}&limit=${limit}` : null,
          tutors: tutors.map((teacher) => {
            const { ...teacherEntity } = TutorEntity.fromObject(teacher);
            return teacherEntity;
          }),
        },
      });
    } catch (error) {
      throw CustomError.internalServer('Internal Server Error');
    }
  }
  // CREAR TUTOR
  async createTutor(dto: TutorDto, user: UserEntity) {
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
      if (user || contact) throw CustomError.badRequest('El tutor ya existe');
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
      const tutor = await prisma.tutors.create({
        data: {
          userId: user.id,
          address: dto.address,
        },
        include: {
          user: true,
        },
      });

      const { ...tutorEntity } = TutorEntity.fromObject(tutor);
      return CustomSuccessful.response({ result: tutorEntity });
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }
  // EDITAR TUTOR
  async updateTutor(dto: TutorDto, user: UserEntity, userId: number) {
    const teacherExists = await prisma.tutors.findFirst({
      where: { userId: userId },
      include: {
        user: true,
      },
    });
    if (!teacherExists) throw CustomError.badRequest('El tutor no existe');

    try {
      await prisma.users.update({
        where: { id: teacherExists.userId },
        data: {
          ...dto,
          password: await bcryptAdapter.hash(teacherExists.user.password),
        },
      });

      const teacher = await prisma.tutors.update({
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
  // ELIMINAR TUTOR
  async deleteTutor(user: UserEntity, userId: number) {
    const tutorExists = await prisma.tutors.findFirst({
      where: { userId: userId },
    });
    if (!tutorExists) throw CustomError.badRequest('El tutor no existe');
    try {
      await prisma.tutors.update({
        where: { userId: userId },
        data: {
          state: false,
        },
      });
      return CustomSuccessful.response({ message: 'Tutor eliminado' });
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }
}
