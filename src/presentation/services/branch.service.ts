import { PrismaClient } from '@prisma/client';
import {
  BranchDto,
  BranchEntity,
  CustomError,
  CustomSuccessful,
  PaginationDto,
  UserEntity,
} from '@/domain';

const prisma = new PrismaClient();

export class BranchService {
  constructor() {}

  // OBTENER SUCURSALES
  async getBranches(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    try {
      const [total, branches] = await Promise.all([
        prisma.branches.count({ where: { state: true } }),
        prisma.branches.findMany({
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
          next: `/api/branch?page=${page + 1}&limit=${limit}`,
          prev:
            page - 1 > 0 ? `/api/branch?page=${page - 1}&limit=${limit}` : null,
          branches: branches.map((branch) => {
            const { ...branchEntity } = BranchEntity.fromObject(branch);
            return branchEntity;
          }),
        },
      });
    } catch (error) {
      throw CustomError.internalServer('Internal Server Error');
    }
  }

  // CREAR SUCURSAL
  async createBranch(dto: BranchDto, user: UserEntity) {
    const branchExists = await prisma.branches.findFirst({
      where: {
        businessId: dto.businessId,
        name: dto.name,
        state: true,
      },
    });
    if (branchExists) throw CustomError.badRequest('La sucursal ya existe');

    try {
      const branch = await prisma.branches.create({
        data: {
          ...dto,
        },
      });

      const { ...branchEntity } = BranchEntity.fromObject(branch);
      return CustomSuccessful.response({ result: branchEntity });
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  // EDITAR SUCURSAL
  async updateBranch(dto: BranchDto, user: UserEntity, branchId: number) {
    const existingBranchWithName = await prisma.branches.findFirst({
      where: {
        AND: [
          { businessId: dto.businessId, name: dto.name },
          { NOT: { id: branchId } },
        ],
      },
    });
    if (existingBranchWithName)
      throw CustomError.badRequest(
        'Ya existe una sucursal con el mismo nombre'
      );

    const branchExists = await prisma.branches.findFirst({
      where: { id: branchId },
    });
    if (!branchExists) throw CustomError.badRequest('La sucursal no existe');

    try {
      const branch = await prisma.branches.update({
        where: { id: branchId },
        data: {
          ...dto,
        },
      });
      const { ...branchEntity } = BranchEntity.fromObject(branch);
      return CustomSuccessful.response({ result: branchEntity });
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  async deleteBranch(user: UserEntity, branchId: number) {
    const branchExists = await prisma.branches.findFirst({
      where: { id: branchId },
    });
    if (!branchExists) throw CustomError.badRequest('La sucursal no existe');
    try {
      await prisma.branches.update({
        where: { id: branchId },
        data: {
          state: false,
        },
      });
      return CustomSuccessful.response({ message: 'Sucursal eliminado' });
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }
}
