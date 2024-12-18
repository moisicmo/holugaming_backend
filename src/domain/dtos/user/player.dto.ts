import { UserDto } from '@/domain';

export class PlayerDto extends UserDto {

  constructor(
    public readonly nick: string,
    userDto: UserDto,
  ) {
    super(userDto.name, userDto.lastName, userDto.typeContact, userDto.data);
  }

  static body(object: { [key: string]: any }): [string?, PlayerDto?] {
    const { phone: nick, ...userData } = object;
    if (!nick) return ['El nick es obligatorio'];
    const [error, userDto] = UserDto.body(userData);
    if (error) return [error];

    return [undefined, new PlayerDto(nick, userDto!)];
  }
}