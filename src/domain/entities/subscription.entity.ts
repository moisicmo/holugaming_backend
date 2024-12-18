import { BusinessEntity, PlanEntity } from '@/domain';

export class SubscriptionEntity {
  constructor(
    public id: number,
    public business: BusinessEntity,
    public plan: PlanEntity,
  ) { }

  static fromObject(object: { [key: string]: any; }) {
    const { id, business, plan } = object;

    const businessEntity = BusinessEntity.fromObject(business);
    const planEntity = PlanEntity.fromObject(plan);

    return new SubscriptionEntity(id, businessEntity,planEntity);
  }
}