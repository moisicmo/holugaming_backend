import { bcryptAdapter } from '@/config';
import { PrismaClient } from '@prisma/client';;
import {
  CustomerDto,
  CustomError,
  PaginationDto,
  UserEntity,
  CustomSuccessful,
  CustomerEntity,
} from '@/domain';


const prisma = new PrismaClient();

export class CustomerService {
  constructor() { }
  // OBTENER TODOS LOS CLIENTES
  async getCustomers(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    try {
      const [total, customers] = await Promise.all([
        prisma.customers.count({ where: { state: true } }),
        prisma.customers.findMany({
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
      return CustomSuccessful.response({
        result: {
          page: page,
          limit: limit,
          total: total,
          next: `/api/customer?page=${page + 1}&limit=${limit}`,
          prev:
            page - 1 > 0
              ? `/api/customer?page=${page - 1}&limit=${limit}`
              : null,
          customers: customers.map((customer) => {
            const { ...customerEntity } = CustomerEntity.fromObject(customer);
            return customerEntity;
          }),
        },
      });
    } catch (error) {
      throw CustomError.internalServer('Internal Server Error');
    }
  }
  // CREAR CLIENTE
  async createCustomer(dto: CustomerDto, userx: UserEntity) {
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
      // buscamos al cliente
      let customer = await prisma.customers.findFirst({
        where: {
          userId: user.id
        }
      });
      if (customer) throw CustomError.badRequest('El cliente ya existe');
      customer = await prisma.customers.create({
          data: {
            userId: user.id,
          },
          include:{
            user:{
              include:{
                contacts:true
              }
            }
          }
      });
      const { ...customerEntity } = CustomerEntity.fromObject(customer);
      return CustomSuccessful.response({ result: customerEntity });
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }
  // EDITAR CLIENTE
  async updateCustomer(dto: CustomerDto, user: UserEntity, userId: number) {
    const customerExists = await prisma.customers.findFirst({
      where: { userId: userId },
      include: {
        user: true,
      },
    });
    if (!customerExists) throw CustomError.badRequest('El cliente no existe');

    try {
      await prisma.users.update({
        where: { id: customerExists.userId },
        data: {
          ...dto,
          password: await bcryptAdapter.hash(customerExists.user.password),
        },
      });

      const customer = await prisma.customers.update({
        where: { userId: userId },
        data: {
          // ...updateTeacherDto,
        },
        include: {
          user: true,
        },
      });

      const { ...customerEntity } = CustomerEntity.fromObject(customer);
      return CustomSuccessful.response({ result: customerEntity });
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }
  // ELIMINAR CLIENTE
  async deleteCustomer(user: UserEntity, userId: number) {
    const customerExists = await prisma.customers.findFirst({
      where: { userId: userId },
    });
    if (!customerExists) throw CustomError.badRequest('El cliente no existe');
    try {
      await prisma.customers.update({
        where: { userId: userId },
        data: {
          state: false,
        },
      });
      return CustomSuccessful.response({ message: 'Cliente eliminado' });
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }
}
