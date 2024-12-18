import { PrismaClient } from '@prisma/client';
import {
  CustomError,
  CustomSuccessful,
  PaginationDto,
  PlanDto,
  PlanEntity,
  UserEntity,
} from '@/domain';

const prisma = new PrismaClient();

export class PlanService {
  constructor() {}

  // OBTENER PLANES
  async getPlans(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    try {
      const [total, plans] = await Promise.all([
        prisma.plans.count({ where: { state: true } }),
        prisma.plans.findMany({
          where: {
            state: true,
          },
          skip: (page - 1) * limit,
          take: limit,
        }),
      ]);

      return CustomSuccessful.response({
        result: {
          page: page,
          limit: limit,
          total: total,
          next: `/api/plan?page=${page + 1}&limit=${limit}`,
          prev:
            page - 1 > 0 ? `/api/plan?page=${page - 1}&limit=${limit}` : null,
          plans: plans.map((plan) => {
            const { ...planEntity } = PlanEntity.fromObject(plan);
            return planEntity;
          }),
        },
      });
    } catch (error) {
      throw CustomError.internalServer('Internal Server Error');
    }
  }

  // CREAR PLAN
  async createPlan(dto: PlanDto, user: UserEntity) {
    const exists = await prisma.plans.findFirst({
      where: {
        name: dto.name,
        state: true,
      },
    });
    if (exists) throw CustomError.badRequest('El plan ya existe');

    try {
      const plan = await prisma.plans.create({
        data: {
          ...dto,
          state:true,
        },
      });

      const { ...planEntity } = PlanEntity.fromObject(plan);
      return CustomSuccessful.response({ result: planEntity });
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  // EDITAR PLAN
  async updatePlan(dto: PlanDto, user: UserEntity, planId: number) {
    const exists = await prisma.plans.findFirst({
      where: {
        AND: [
          { name: dto.name },
          { NOT: { id: planId } },
        ],
      },
    });
    if (exists)
      throw CustomError.badRequest(
        'Ya existe un plan con el mismo nombre'
      );

    const planExists = await prisma.plans.findFirst({
      where: { id: planId },
    });
    if (!planExists) throw CustomError.badRequest('El plan no existe');

    try {
      const plan = await prisma.plans.update({
        where: { id: planId },
        data: {
          ...dto,
        },
      });
      const { ...planEntity } = PlanEntity.fromObject(plan);
      return CustomSuccessful.response({ result: planEntity });
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  // ELIMINAR PLAN
  async deletePlan(user: UserEntity, planId: number) {
    const exists = await prisma.plans.findFirst({
      where: { id: planId },
    });
    if (!exists) throw CustomError.badRequest('El plan no existe');
    try {
      await prisma.plans.update({
        where: { id: planId },
        data: {
          state: false,
        },
      });
      return CustomSuccessful.response({ message: 'Plan eliminado' });
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }
}
