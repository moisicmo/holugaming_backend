import { BusinessEntity } from '@/domain';

export class BranchEntity {
  constructor(
    public id: number,
    public name: string,
    public address: string,
    public phone: string,
    public business: BusinessEntity,
  ) { }

  static fromObject(object: { [key: string]: any; }) {
    const { id, name, address, phone, business } = object;
    const businessEntity = BusinessEntity.fromObject(business);

    return new BranchEntity(id, name, address, phone, businessEntity);
  }
}
