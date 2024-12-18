import { bcryptAdapter } from '@/config';
import { PrismaClient } from '@prisma/client';;
import {
  PlayerDto,
  CustomError,
  PaginationDto,
  UserEntity,
  CustomSuccessful,
  PlayerEntity,
} from '@/domain';


const prisma = new PrismaClient();

export class PlayerService {
  constructor() { }

  // OBTENER TODOS LOS JUGADORES
  async getPlayers(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    try {
      const [total, pleyers] = await Promise.all([
        prisma.players.count({ where: { state: true } }),
        prisma.players.findMany({
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
      
      const list = pleyers.map((player) => PlayerEntity.fromObject(player));

      const result = {
        page: page,
        limit: limit,
        total: total,
        next: `/api/player?page=${page + 1}&limit=${limit}`,
        prev:
          page - 1 > 0
            ? `/api/player?page=${page - 1}&limit=${limit}`
            : null,
        players: list,
      };
      return CustomSuccessful.response({ result: result });
    } catch (error) {
      throw CustomError.internalServer('Internal Server Error');
    }
  }

  // CREAR JUGADOR
  async createPlayer(dto: PlayerDto, userx: UserEntity) {
    try {
      // buscamos al usuario
      let user = await prisma.users.findFirst({
        where: {
          contacts: {
            some: {
              typeContact: dto.typeContact,
              data: dto.data,
            },
          },
        },
      });
      // si no encontramos al usuario, creamos al usuario con su contacto      
      if (!user) {
        user = await prisma.users.create({
          data: {
            name: dto.name,
            lastName: dto.lastName,
            password: await bcryptAdapter.hash(dto.data),
            contacts: {
              create: {
                typeContact: dto.typeContact,
                data: dto.data,
              },
            },
          },
        });
      }
      // buscamos al jugador
      let player = await prisma.players.findFirst({
        where: {
          userId: user.id
        }
      });
      if (player) throw CustomError.badRequest('El jugador ya existe');
      player = await prisma.players.create({
        data: {
          nick: dto.nick,
          userId: user.id,
        },
        include: {
          user: {
            include: {
              contacts: true
            }
          }
        }
      });
      const { ...playerEntity } = PlayerEntity.fromObject(player);
      return CustomSuccessful.response({ result: playerEntity });
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  // EDITAR JUGADOR
  async updatePlayer(dto: PlayerDto, user: UserEntity, userId: number) {
    const playerExists = await prisma.players.findFirst({
      where: { userId: userId },
      include: {
        user: true,
      },
    });
    if (!playerExists) throw CustomError.badRequest('El jugador no existe');

    try {
      await prisma.users.update({
        where: { id: playerExists.userId },
        data: {
          ...dto,
          password: await bcryptAdapter.hash(playerExists.user.password),
        },
      });

      const player = await prisma.players.update({
        where: { userId: userId },
        data: {
          // ...updateTeacherDto,
        },
        include: {
          user: true,
        },
      });

      const { ...playerEntity } = PlayerEntity.fromObject(player);
      return CustomSuccessful.response({ result: playerEntity });
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  // ELIMINAR JUGADOR
  async deletePlayer(user: PlayerDto, userId: number) {
    const playerExists = await prisma.players.findFirst({
      where: { userId: userId },
    });
    if (!playerExists) throw CustomError.badRequest('El jugador no existe');
    try {
      await prisma.players.update({
        where: { userId: userId },
        data: {
          state: false,
        },
      });
      return CustomSuccessful.response({ message: 'Jugador eliminado' });
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }
}
