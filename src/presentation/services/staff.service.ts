import { Prisma, PrismaClient } from '@prisma/client';
import {
  StaffDto,
  CustomError,
  PaginationDto,
  StaffEntity,
  UserEntity,
  CustomSuccessful,
} from '@/domain';
import { bcryptAdapter } from '@/config';

const prisma = new PrismaClient();

export class StaffService {
  constructor() {}
  // OBTENER TODOS LOS STAFF
  async getStaffs(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    try {
      const [total, staffs] = await Promise.all([
        prisma.staffs.count({ where: { state: true } }),
        prisma.staffs.findMany({
          where: {
            state: true,
          },
          skip: (page - 1) * limit,
          take: limit,
          include: {
            user: true,
            role: true,
          },
        }),
      ]);

      return CustomSuccessful.response({
        result: {
          page: page,
          limit: limit,
          total: total,
          next: `/api/staff?page=${page + 1}&limit=${limit}`,
          prev:
            page - 1 > 0 ? `/api/staff?page=${page - 1}&limit=${limit}` : null,
          staffs: staffs.map((staff) => {
            const { ...staffEntity } = StaffEntity.fromObject(staff);
            return staffEntity;
          }),
        },
      });
    } catch (error) {
      throw CustomError.internalServer('Internal Server Error');
    }
  }
  // CREAR STAFF
  async createStaff(dto: StaffDto, user: UserEntity) {
    try {
      let user = await prisma.users.findFirst({
        where: {
          numberDocument: dto.dni,
        },
      });
      const contact = await prisma.contacts.findFirst({
        where: {
          data: dto.data,
          typeContact: dto.typeContact,
        },
      });
      if (user || contact) throw CustomError.badRequest('El staff ya existe');
      // creamos al usuario
      user = await prisma.users.create({
        data: {
          numberDocument: dto.dni,
          name: dto.name,
          lastName: dto.lastName,
          password: await bcryptAdapter.hash(dto.data),
        },
      });
      // creamos el contacto
      await prisma.contacts.create({
        data: {
          userId: user.id,
          typeContact: dto.typeContact,
          data: dto.data,
        },
      });

      const staff = await prisma.staffs.create({
        data: {
          userId: user.id,
          roleId: dto.roleId,
        },
        include: {
          user: true,
          role: true,
        },
      });

      const { ...staffEntity } = StaffEntity.fromObject(staff);
      return CustomSuccessful.response({ result: staffEntity });
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }
  // EDITAR STAFF
  async updateStaff(
    updateStaffDto: StaffDto,
    user: UserEntity,
    userId: number
  ) {
    const staffExists = await prisma.staffs.findFirst({
      where: { userId: userId },
      include: {
        user: true,
        role: true,
      },
    });
    if (!staffExists) throw CustomError.badRequest('El staff no existe');

    try {
      await prisma.users.update({
        where: { id: staffExists.userId },
        data: {
          ...updateStaffDto,
          password: await bcryptAdapter.hash(staffExists.user.password),
        },
      });

      const staff = await prisma.staffs.update({
        where: { userId: userId },
        data: {
          ...updateStaffDto,
          roleId: updateStaffDto.roleId,
        },
        include: {
          user: true,
          role: true,
        },
      });

      const { ...staffEntity } = StaffEntity.fromObject(staff);
      return CustomSuccessful.response({ result: staffEntity });
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }
  // ELIMINAR STAFF
  async deleteStaff(user: UserEntity, userId: number) {
    const staffExists = await prisma.staffs.findFirst({
      where: { userId: userId },
    });
    if (!staffExists) throw CustomError.badRequest('El staff no existe');
    try {
      await prisma.staffs.update({
        where: { userId: userId },
        data: {
          state: false,
        },
      });
      return CustomSuccessful.response({ message: 'Staff eliminado' });
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }
}
