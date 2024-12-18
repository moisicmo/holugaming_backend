import { TypeBusiness } from '@/domain';
export class BusinessEntity {
  constructor(
    public id: number,
    public TypeBusiness: TypeBusiness,
    public name: string,
    public url: string,

  ) { }

  static fromObject(object: { [key: string]: any; }) {
    const { id, TypeBusiness, name, url } = object;
    return new BusinessEntity(id, TypeBusiness, name, url);
  }
}
