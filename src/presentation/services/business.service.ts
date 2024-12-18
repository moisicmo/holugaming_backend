import { PrismaClient } from '@prisma/client';
import {
  BusinessDto,
  BusinessEntity,
  CustomError,
  CustomSuccessful,
  PaginationDto,
  UserEntity,
} from '@/domain';

const prisma = new PrismaClient();

export class BusinessService {
  constructor() { }

  // OBTENER NEGOCIOS
  async getBusiness(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    try {
      const [total, businesses] = await Promise.all([
        prisma.businesses.count({ where: { state: true } }),
        prisma.businesses.findMany({
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
          next: `/api/business?page=${page + 1}&limit=${limit}`,
          prev:
            page - 1 > 0
              ? `/api/business?page=${page - 1}&limit=${limit}`
              : null,
          business: businesses.map((business) => {
            const { ...businessEntity } = BusinessEntity.fromObject(business);
            return businessEntity;
          }),
        },
      });
    } catch (error) {
      throw CustomError.internalServer('Internal Server Error');
    }
  }

  // CREAR NEGOCIO
  async createBusiness(dto: BusinessDto, user: UserEntity) {
    try {
      const businessExists = await prisma.businesses.findFirst({
        where: {
          name: dto.name,
        },
      });
      if (businessExists) throw CustomError.badRequest('El negocio ya existe');

      const business = await prisma.businesses.create({
        data: {
          ...dto,
          branches: {
            create: {
              name: dto.name,
              users: {
                connect: [{ id: user.id }]
              }
            },
          }
        },
      });

      const { ...businessEntity } = BusinessEntity.fromObject(business);
      return CustomSuccessful.response({ result: businessEntity });
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  // EDITAR NEGOCIO
  async updateBusiness(dto: BusinessDto, user: UserEntity, businessId: number) {
    const existingBusinessWithName = await prisma.businesses.findFirst({
      where: {
        AND: [{ name: dto.name }, { NOT: { id: businessId } }],
      },
    });
    if (existingBusinessWithName)
      throw CustomError.badRequest('Ya existe un negocio con el mismo nombre');

    const businessExists = await prisma.businesses.findFirst({
      where: { id: businessId },
    });
    if (!businessExists) throw CustomError.badRequest('El negocio no existe');

    try {
      const business = await prisma.businesses.update({
        where: { id: businessId },
        data: {
          ...dto,
        },
      });
      const { ...businessEntity } = BusinessEntity.fromObject(business);
      return CustomSuccessful.response({ result: businessEntity });
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  async deleteBusiness(user: UserEntity, businessId: number) {
    const businessExists = await prisma.businesses.findFirst({
      where: { id: businessId },
    });
    if (!businessExists) throw CustomError.badRequest('El negocio no existe');
    try {
      await prisma.businesses.update({
        where: { id: businessId },
        data: {
          state: false,
        },
      });
      return CustomSuccessful.response({ message: 'Negocio eliminado' });
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }
}
