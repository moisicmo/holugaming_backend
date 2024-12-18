export class BranchDto {

  private constructor(
    public readonly businessId: number,
    public readonly name: string,
    public readonly address: string,
    public readonly phone: string,
  ) { }


  static body(object: { [key: string]: any }): [string?, BranchDto?] {

    const { businessId, name, address, phone } = object;

    if (!businessId) return ['El id del negocio es obligatorio'];
    if (!name) return ['El nombre es obligatorio'];
    if (!address) return ['La dirección es obligatorio'];
    if (!phone) return ['El teléfono es obligatorio'];

    return [undefined, new BranchDto(businessId, name, address, phone)];

  }

}