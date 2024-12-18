import {
  CustomError,
  CustomSuccessful,
  LoginUserDto,
  UserEntity,
  ValidateUserDto,
} from '@/domain';
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { bcryptAdapter, JwtAdapter } from '@/config';
import { EmailService } from '..';

const prisma = new PrismaClient();

export class AuthService {

  constructor(
    private readonly emailService: EmailService
  ) { }

  public async loginUser(dto: LoginUserDto) {

    const user = await prisma.users.findFirst({
      where: {
        contacts: {
          some: {
            typeContact: dto.typeContact,
            data: dto.data,
          },
        },
      },
      include: {
        contacts: true,
        staff: {
          include: {
            role: {
              include: {
                permissions: true,
              },
            },
          },
        },
        student: true,
        teacher: true,
        customer: true,
        branches: {
          include: {
            business: true,
          }
        },
      }
    })
    if (!user) throw CustomError.badRequest('No se pudo autenticar al usuario');

    const isMatching = bcryptAdapter.compare(
      dto.password,
      user.password
    );
    if (!isMatching) throw CustomError.badRequest('La Contraseña no es valida');
    const token = await JwtAdapter.generateToken({ id: user.id });
    if (!token) throw CustomError.internalServer('Error al crear la llave');

    // if (!user.contacts[0].validated) {
    //   const codeValidation = await this.sendEmailValidationLink(
    //     dto.data
    //   );
    //   await prisma.contacts.update({
    //     where: { userId: user.contacts[0].userId, typeContact: user.contacts[0].typeContact, },
    //     data: { codeValidation: await bcryptAdapter.hash(codeValidation) },
    //   });
    //   return CustomSuccessful.response({
    //     statusCode: 1,
    //     message: 'Es necesario validar',
    //     result: { token },
    //   });
    // }
    const { ...userEntity } = UserEntity.fromObjectAuth(user);

    return CustomSuccessful.response({
      result: {
        user: userEntity,
        token: token,
      },
    });
  }

  public validateEmail = async (validateUserDto: ValidateUserDto, user: UserEntity) => {
    try {
      // const isMatching = bcryptAdapter.compare(
      //   validateUserDto.code,
      //   user.codeValidation!
      // );
      // if (!isMatching) throw CustomError.badRequest('El código es incorrecto');
      // await prisma.users.update({
      //   where: { id: user.id },
      //   data: { emailValidated: true },
      // });

      // return CustomSuccessful.response({ message: 'Verificación correcta' });
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  };

  private sendEmailValidationLink = async (email: string) => {
    const codeg = uuidv4().substring(0, 4);
    let verificationLink = `código: ${codeg}`;
    const html = `
      <h1>Valida tu correo electrónico</h1>
      <p>Inserte el siguiente código para completar el proceso</p>
      <br>
      <h1>${verificationLink}</h1>
    `;
    const options = {
      // from: `"CENTRO DE ESTUDIANTES" < ${process.env.USERGMAIL} > `,
      from:'sadsads',
      to: email,
      subject: 'Código de verificación',
      htmlBody: html,
    };
    const isSent = await this.emailService.sendEmail(options);
    if (!isSent) throw CustomError.internalServer('Error al enviar el correo');

    return codeg;
  };
}
