import { PrismaClient } from '@prisma/client';
import {
  TournamentDto,
  TournamentEntity,
  UserEntity,
  CustomError,
  PaginationDto,
  CustomSuccessful,
} from '@/domain';
// import { bcryptAdapter } from '@/config';

const prisma = new PrismaClient();

export class TournamentService {
  constructor() {}
  // OBTENER TODAS LOS TORNEOS
  async getTournaments(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    try {
      const [total, tournaments] = await Promise.all([
        prisma.tournaments.count({ where: { state: true } }),
        prisma.tournaments.findMany({
          where: {
            state: true,
          },
          skip: (page - 1) * limit,
          take: limit,
          include: {
            game:true
          },
        }),
      ]);
      return CustomSuccessful.response({
        result: {
          page: page,
          limit: limit,
          total: total,
          next: `/api/tournament?page=${page + 1}&limit=${limit}`,
          prev:
            page - 1 > 0 ? `/api/tournament?page=${page - 1}&limit=${limit}` : null,
          tournaments: tournaments.map((tournament) => {
            console.log(JSON.stringify(tournament));
            const { ...tournamentEntity } = TournamentEntity.fromObject(tournament);
            return tournamentEntity;
          }),
        },
      });
    } catch (error) {
      throw CustomError.internalServer('Internal Server Error');
    }
  }
  // OBTENER TORNEO POR ID
  async getTournamentById(tournamentId: number){
    try {
      let tournament = await prisma.tournaments.findUnique({
        where:{
          id:tournamentId
        },
        include: {
          inscriptions:{
            include:{
              team:{
                include:{
                  teamToPlayers:true
                }
              }
            }
          },
          game:true
        },
      })
      if (!tournament) throw CustomError.badRequest('El torneo no existe');
      const { ...inscriptionEntity } = TournamentEntity.fromObject(tournament);
      return CustomSuccessful.response({ result: inscriptionEntity });
    } catch (error) {
      throw CustomError.internalServer('Internal Server Error');
    }
  }
  // CREAR INSCRIPCIÓN
  async createTournament(dto: TournamentDto, user: UserEntity) {
    try {
      let tournament = await prisma.tournaments.findFirst({
        where: {
          name: dto.name
          // teamId: dto.teamId,
          // tournamentId: dto.tournamentId,
        },
      });
      if (tournament) throw CustomError.badRequest('El torneo ya existe');
      // creamos la inscripción
      tournament =  await prisma.tournaments.create({
        data: {
          ...dto
          // teamId: dto.teamId,
          // tournamentId: dto.tournamentId,
        },
        include:{
          game:true
        }
      });
      console.log(JSON.stringify(tournament));
      const { ...inscriptionEntity } = TournamentEntity.fromObject(tournament);
      return CustomSuccessful.response({ result: inscriptionEntity });
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }
  // EDITAR INSCRIPCIÓN
  async updateTournament(dto: TournamentDto, user: UserEntity, userId: number) {
    const teamExists = await prisma.teams.findFirst({
      // where: { userId: userId },
      include: {
        // user: true,
      },
    });
    if (!teamExists) throw CustomError.badRequest('El torneo no existe');

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
