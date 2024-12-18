import { PrismaClient } from '@prisma/client';
import {
  RoleDto,
  CustomError,
  PaginationDto,
  RoleEntity,
  UserEntity,
  CustomSuccessful,
} from '@/domain';

const prisma = new PrismaClient();

export class RoleService {
  constructor() {}

  // OBTENER ROLES
  async getRoles(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    try {
      const [total, roles] = await Promise.all([
        prisma.roles.count({ where: { state: true } }),
        prisma.roles.findMany({
          skip: (page - 1) * limit,
          take: limit,
          where: {
            state: true,
          },
          include: {
            permissions: true,
          },
        }),
      ]);

      return CustomSuccessful.response({
        result: {
          page: page,
          limit: limit,
          total: total,
          next: `/api/role?page=${page + 1}&limit=${limit}`,
          prev:
            page - 1 > 0 ? `/api/role?page=${page - 1}&limit=${limit}` : null,
          roles: roles.map((role) => {
            const { ...roleEntity } = RoleEntity.fromObject(role);
            return roleEntity;
          }),
        },
      });
    } catch (error) {
      throw CustomError.internalServer('Internal Server Error');
    }
  }

  // CREAR ROL
  async createRole(dto: RoleDto, user: UserEntity) {
    const { permissions } = dto;
    const roleExists = await prisma.roles.findFirst({
      where: {
        businessId: dto.businessId,
        name: dto.name,
      },
    });
    if (roleExists) throw CustomError.badRequest('El rol ya existe');

    try {
      const role = await prisma.roles.create({
        data: {
          ...dto,
          permissions: {
            connect: permissions.map((permissionId) => ({ id: permissionId })),
          },
        },
        include: {
          permissions: true,
        },
      });

      const { ...roleEntity } = RoleEntity.fromObject(role);
      return CustomSuccessful.response({ result: roleEntity });
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  // EDITAR ROL
  async updateRole(dto: RoleDto, user: UserEntity, roleId: number) {
    const existingRoleWithName = await prisma.roles.findFirst({
      where: {
        AND: [
          { businessId: dto.businessId, name: dto.name },
          { NOT: { id: roleId } },
        ],
      },
    });
    if (existingRoleWithName)
      throw CustomError.badRequest('Ya existe un rol con el mismo nombre');
    const roleExists = await prisma.roles.findFirst({
      where: { id: roleId },
      include: {
        permissions: true,
      },
    });
    if (!roleExists) throw CustomError.badRequest('El rol no existe');

    try {
      const role = await prisma.roles.update({
        where: { id: roleId },
        data: {
          name: dto.name,
          permissions: {
            disconnect: roleExists.permissions.map((permission) => ({
              id: permission.id,
            })),
            connect: dto.permissions.map((permissionId) => ({
              id: permissionId,
            })),
          },
        },
        include: {
          permissions: true,
        },
      });
      const { ...roleEntity } = RoleEntity.fromObject(role!);
      return CustomSuccessful.response({ result: roleEntity });
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  // ELIMINAR ROL
  async deleteRole(user: UserEntity, roleId: number) {
    const roleExists = await prisma.roles.findFirst({
      where: { id: roleId },
      include: {
        permissions: true,
      },
    });
    if (!roleExists) throw CustomError.badRequest('El rol no existe');
    try {
      await prisma.roles.update({
        where: { id: roleId },
        data: {
          state: false,
          permissions: {
            disconnect: roleExists.permissions.map((permission) => ({
              id: permission.id,
            })),
          },
        },
        include: {
          permissions: true,
        },
      });

      return CustomSuccessful.response({ message: 'Rol eliminado' });
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }
}
