import { UserDto } from '@/domain';

export class TutorDto extends UserDto {

  constructor(
    public readonly phone: string,
    public address: string,
    userDto: UserDto
  ) {
    super(userDto.name, userDto.lastName, userDto.typeContact, userDto.data);
  }

  static body(object: { [key: string]: any }): [string?, TutorDto?] {
    const { phone,address,...userData } = object;

    if (!phone) return ['El teléfono es obligatorio'];
    if (!address) return ['La dirección es obligatorio'];
    const [error, userDto] = UserDto.body(userData);
    if (error) return [error];

    return [undefined, new TutorDto(phone,address,userDto!)];
  }
}
