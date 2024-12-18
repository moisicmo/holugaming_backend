import { PrismaClient } from '@prisma/client';
import {
  CustomError,
  CustomSuccessful,
  PaginationDto,
  SubscriptionDto,
  SubscriptionEntity,
  UserEntity,
} from '@/domain';

const prisma = new PrismaClient();

export class SubscriptionService {
  constructor() { }

  // OBTENER SUSCRIPCIONES
  async getSubscriptions(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    try {
      const [total, subscriptions] = await Promise.all([
        prisma.subscriptions.count({ where: { state: true } }),
        prisma.subscriptions.findMany({
          where: {
            state: true,
          },
          skip: (page - 1) * limit,
          take: limit,
          include: {
            business: true,
            plan: true,
          }
        }),
      ]);
      return CustomSuccessful.response({
        result: {
          page: page,
          limit: limit,
          total: total,
          next: `/api/subscription?page=${page + 1}&limit=${limit}`,
          prev:
            page - 1 > 0 ? `/api/subscription?page=${page - 1}&limit=${limit}` : null,
          subscriptions: subscriptions.map((subscription) => {
            const { ...subscriptionEntity } = SubscriptionEntity.fromObject(subscription);
            return subscriptionEntity;
          }),
        },
      });
    } catch (error) {
      throw CustomError.internalServer('Internal Server Error');
    }
  }

  // CREAR SUSCRIPCIÓN
  async createSubscription(dto: SubscriptionDto, user: UserEntity) {
    // buscamos el negocio
    const business = await prisma.businesses.findFirst({
      where: {
        id: dto.businessId,
        branches: {
          some: {
            users: {
              some: {
                id: user.id
              }
            }
          },
        }
      }
    });
    if (!business) throw CustomError.badRequest('No se pudo encontrar el negocio solicitado');
    // buscamos el plan
    const plan = await prisma.plans.findFirst({
      where: {
        id: dto.planId,
        state: true,
      }
    });
    if (!plan) throw CustomError.badRequest('No se pudo encontrar el plan solicitado');
    // buscamos si ya existe la suscripción
    const exists = await prisma.subscriptions.findFirst({
      where: {
        businessId: dto.businessId,
        state: true,
      },
    });
    if (exists) throw CustomError.badRequest('La suscripción ya existe');

    try {
      const subscription = await prisma.subscriptions.create({
        data: {
          ...dto,
        },
        include: {
          business: true,
          plan: true,
        }
      });

      const { ...subscriptionEntity } = SubscriptionEntity.fromObject(subscription);
      return CustomSuccessful.response({ result: subscriptionEntity });
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  // EDITAR SUSCRIPCIÓN
  async updateSubscription(dto: SubscriptionDto, user: UserEntity, subscriptionId: number) {
    const exists = await prisma.subscriptions.findFirst({
      where: {
        AND: [
          { NOT: { id: subscriptionId } },
        ],
      },
    });
    if (exists)
      throw CustomError.badRequest(
        'Ya existe una suscrpción'
      );

    const subscriptionExists = await prisma.subscriptions.findFirst({
      where: { id: subscriptionId },
    });
    if (!subscriptionExists) throw CustomError.badRequest('La suscripción no existe');

    try {
      const subscription = await prisma.subscriptions.update({
        where: { id: subscriptionId },
        data: {
          ...dto,
        },
      });
      const { ...subscriptionEntity } = SubscriptionEntity.fromObject(subscription);
      return CustomSuccessful.response({ result: subscriptionEntity });
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  // ELIMINAR SUSCRIPCIÓN
  async deleteSubscription(user: UserEntity, subscriptionId: number) {
    const exists = await prisma.subscriptions.findFirst({
      where: { id: subscriptionId },
    });
    if (!exists) throw CustomError.badRequest('La inscripción no existe');
    try {
      await prisma.subscriptions.update({
        where: { id: subscriptionId },
        data: {
          state: false,
        },
      });
      return CustomSuccessful.response({ message: 'Inscripción eliminado' });
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }
}
