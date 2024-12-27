import { PrismaClient } from '@prisma/client';
import {
  TeamDto,
  TeamEntity,
  UserEntity,
  CustomError,
  PaginationDto,
  CustomSuccessful,
} from '@/domain';
// import { bcryptAdapter } from '@/config';

const prisma = new PrismaClient();

export class TeamService {
  constructor() {}
  // OBTENER TODOS LOS EQUIPOS
  async getTeams(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    try {
      const [total, teams] = await Promise.all([
        prisma.teams.count({ where: { state: true } }),
        prisma.teams.findMany({
          where: {
            state: true,
          },
          skip: (page - 1) * limit,
          take: limit,
          include: {
            teamToPlayers: true,
          },
        }),
      ]);
      return CustomSuccessful.response({
        result: {
          page: page,
          limit: limit,
          total: total,
          next: `/api/team?page=${page + 1}&limit=${limit}`,
          prev:
            page - 1 > 0 ? `/api/team?page=${page - 1}&limit=${limit}` : null,
          teams: teams.map((team) => {
            const { ...teamEntity } = TeamEntity.fromObject(team);
            return teamEntity;
          }),
        },
      });
    } catch (error) {
      throw CustomError.internalServer('Internal Server Error');
    }
  }
  // CREAR TEAM
  async createTeam(dto: TeamDto, user: UserEntity) {
    try {
      let team = await prisma.teams.findFirst({
        where: {
          name: dto.name,
        },
      });
      if (team) throw CustomError.badRequest('El equipo ya existe');
      // creamos al equipo
      team =  await prisma.teams.create({
        data: {
          gameId: dto.gameId,
          name: dto.name,
          teamToPlayers: {
            create: dto.players.map((player) => ({
              playerId: player.playerId,
              role: player.role,
              nick: player.nick,
            })),
          },
        },
        include: {
          teamToPlayers: true,
        },
      });
      const { ...teamEntity } = TeamEntity.fromObject(team);
      return CustomSuccessful.response({ result: teamEntity });
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }
  // EDITAR EQUIPO
  async updateTeam(dto: TeamDto, user: UserEntity, userId: number) {
    const teamExists = await prisma.teams.findFirst({
      // where: { userId: userId },
      include: {
        // user: true,
      },
    });
    if (!teamExists) throw CustomError.badRequest('El equipo no existe');

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
  // ELIMINAR EQUIPO
  async deleteTeam(user: UserEntity, userId: number) {
    // const tutorExists = await prisma.tutors.findFirst({
    //   where: { userId: userId },
    // });
    // if (!tutorExists) throw CustomError.badRequest('El tutor no existe');
    // try {
    //   await prisma.tutors.update({
    //     where: { userId: userId },
    //     data: {
    //       state: false,
    //     },
    //   });
    //   return CustomSuccessful.response({ message: 'Tutor eliminado' });
    // } catch (error) {
    //   throw CustomError.internalServer(`${error}`);
    // }
  }
}
