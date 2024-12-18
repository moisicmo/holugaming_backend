import { UserDto } from '@/domain';

export class StaffDto extends UserDto {
  public readonly roleId: number;

  constructor(
    roleId: number,
    userDto: UserDto
  ) {
    super(userDto.name, userDto.lastName, userDto.typeContact, userDto.data, userDto.dni);
    this.roleId = roleId;
  }

  static body(object: { [key: string]: any }): [string?, StaffDto?] {
    const { roleId, ...userData } = object;

    if (!roleId) return ['El rol es obligatorio'];

    const [error, userDto] = UserDto.body(userData);
    if (error) return [error];

    return [undefined, new StaffDto(roleId, userDto!)];
  }
}
