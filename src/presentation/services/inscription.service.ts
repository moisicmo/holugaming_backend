import { PrismaClient } from '@prisma/client';
import {
  InscriptionDto,
  InscriptionEntity,
  UserEntity,
  CustomError,
  PaginationDto,
  CustomSuccessful,
} from '@/domain';
// import { bcryptAdapter } from '@/config';

const prisma = new PrismaClient();

export class InscriptionService {
  constructor() {}
  // OBTENER TODAS LAS INSCRIPCIONES
  async getInscriptions(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    try {
      const [total, inscriptions] = await Promise.all([
        prisma.inscriptions.count({ where: { state: true } }),
        prisma.inscriptions.findMany({
          where: {
            state: true,
          },
          skip: (page - 1) * limit,
          take: limit,
          // include: {
          //   user: true,
          // },
        }),
      ]);
      return CustomSuccessful.response({
        result: {
          page: page,
          limit: limit,
          total: total,
          next: `/api/inscription?page=${page + 1}&limit=${limit}`,
          prev:
            page - 1 > 0 ? `/api/inscription?page=${page - 1}&limit=${limit}` : null,
          inscriptions: inscriptions.map((team) => {
            const { ...inscriptionEntity } = InscriptionEntity.fromObject(team);
            return inscriptionEntity;
          }),
        },
      });
    } catch (error) {
      throw CustomError.internalServer('Internal Server Error');
    }
  }
  // CREAR INSCRIPCIÓN
  async createInscription(dto: InscriptionDto, user: UserEntity) {
    try {
      let inscription = await prisma.inscriptions.findFirst({
        where: {
          teamId: dto.teamId,
          tournamentId: dto.tournamentId,
        },
      });
      if (inscription) throw CustomError.badRequest('La inscripción ya existe');
      // creamos la inscripción
      inscription =  await prisma.inscriptions.create({
        data: {
          teamId: dto.teamId,
          tournamentId: dto.tournamentId,
        },
        include:{
          team:true
        }
      });
      console.log(JSON.stringify(inscription));
      const { ...inscriptionEntity } = InscriptionEntity.fromObject(inscription);
      return CustomSuccessful.response({ result: inscriptionEntity });
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }
  // EDITAR INSCRIPCIÓN
  async updateInscription(dto: InscriptionDto, user: UserEntity, userId: number) {
    const teamExists = await prisma.teams.findFirst({
      // where: { userId: userId },
      include: {
        // user: true,
      },
    });
    if (!teamExists) throw CustomError.badRequest('La inscripción no existe');

    try {
      // await prisma.users.update({
      //   where: { id: teacherExists.userId },
      //   data: {
      //     ...dto,
      //     password: await bcryptAdapter.hash(teacherExists.user.password),
      //   },
      // });

      // const teacher = await prisma.tutors.update({
      //   where: { userId: userId },
      //   data: {
      //     // ...updateTeacherDto,
      //   },
      //   include: {
      //     user: true,
      //   },
      // });

      // const { ...teacherEntity } = TeacherEntity.fromObject(teacher);
      // return CustomSuccessful.response({ result: teacherEntity });
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }
}
