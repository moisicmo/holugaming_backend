import { UserDto } from '@/domain';

export class CustomerDto extends UserDto {

  constructor(
    userDto: UserDto,
  ) {
    super( userDto.name, userDto.lastName, userDto.typeContact, userDto.data);
  }

  static body(object: { [key: string]: any }): [string?, CustomerDto?] {
    const { ...userData } = object;
    const [error, userDto] = UserDto.body(userData);
    if (error) return [error];

    return [undefined, new CustomerDto(userDto!)];
  }
}
