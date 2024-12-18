export class RoleDto {
  private constructor(
    public readonly businessId: number,
    public readonly name: string,
    public permissions: number[]
  ) {}

  static body(object: { [key: string]: any }): [string?, RoleDto?] {
    const { businessId, name, permissions } = object;

    if (!businessId) return ['El id del negocio es obligatorio'];
    if (!name) return ['El nombre es obligatorio'];
    if (!permissions) return ['Los permisos son obligatorios'];
    if (permissions.length == 0) return ['Debe ver almenos un permiso'];

    return [undefined, new RoleDto(businessId, name, permissions)];
  }
}
