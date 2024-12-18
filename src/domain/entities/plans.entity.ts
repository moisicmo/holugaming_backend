import { TypePlan } from '@/domain';

export class PlanEntity {
  constructor(
    public id: number,
    public name: string,
    public price: number,
    public discountPrice: number,
    public typePlan: TypePlan,
    public billingCycle: number,
    public features: string,
    public userLimit: number | undefined
  ) { }

  static fromObject(object: { [key: string]: any; }) {
    const { id, name, price, discountPrice, typePlan, billingCycle, features, userLimit } = object;
    return new PlanEntity(id, name, price, discountPrice, typePlan, billingCycle, features, userLimit);
  }
}