import { PrismaClient } from '@prisma/client';
import {
  CustomError,
  CustomSuccessful,
  PaginationDto
} from '@/domain';

const prisma = new PrismaClient();

export class PermissionService {
  constructor() {}

  // OBTENER PERMISOS
  async getPermissions(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    try {
      const [total, permissions] = await Promise.all([
        prisma.permissions.count(),
        prisma.permissions.findMany({
          skip: (page - 1) * limit,
          take: limit,
        }),
      ]);

      return CustomSuccessful.response({
        result: {
          page: page,
          limit: limit,
          total: total,
          next: `/api/permission?page=${page + 1}&limit=${limit}`,
          prev:
            page - 1 > 0
              ? `/api/permission?page=${page - 1}&limit=${limit}`
              : null,

          permissions: permissions.map((permission) => ({
            id: permission.id,
            name: permission.name,
            module: permission.module,
          })),
        },
      });
    } catch (error) {
      throw CustomError.internalServer('Internal Server Error');
    }
  }
}
