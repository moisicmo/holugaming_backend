import { TypeContact, TypeDocument } from '@/domain';

export class UserDto {
  constructor(
    public readonly name: string,
    public readonly lastName: string,
    public readonly typeContact: TypeContact,
    public readonly data: string,
    public readonly dni?: string,
    public readonly typeDocument?: TypeDocument,
  ) { }

  static body(object: { [key: string]: any }): [string?, UserDto?] {
    const { name, lastName, typeContact, data, dni, typeDocument } = object;

    if (!name) return ['El nombre es obligatorio'];
    if (!lastName) return ['El apellido es obligatorio'];
    if (!typeContact) return ['El tipo de contacto es necesario'];
    if (!data) return ['El contacto es obligatorio'];

    return [undefined, new UserDto(name, lastName, typeContact, data, dni, typeDocument)];
  }
}
