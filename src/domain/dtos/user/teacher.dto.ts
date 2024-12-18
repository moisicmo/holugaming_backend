import { UserDto } from '@/domain';

export class TeacherDto extends UserDto {

  constructor(
    public readonly phone: string,
    userDto: UserDto,
  ) {
    super(userDto.name, userDto.lastName, userDto.typeContact, userDto.data);
  }

  static body(object: { [key: string]: any }): [string?, TeacherDto?] {
    const { phone, ...userData } = object;
    if (!phone) return ['El teléfono es obligatorio'];
    const [error, userDto] = UserDto.body(userData);
    if (error) return [error];

    return [undefined, new TeacherDto(phone, userDto!)];
  }
}
