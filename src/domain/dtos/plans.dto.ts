import { TypePlan } from '@/domain';

export class PlanDto {
  private constructor(
    public readonly name: string,
    public readonly price: number,
    public readonly discountPrice: number,
    public readonly typePlan: TypePlan,
    public readonly billingCycle: number,
    public readonly features: string,
    public readonly userLimit: number | undefined
  ) {}

  static body(object: { [key: string]: any }): [string?, PlanDto?] {
    const {
      name,
      price,
      discountPrice,
      typePlan,
      billingCycle,
      features,
      userLimit,
    } = object;

    if (!name) return ['El nombre es obligatorio'];
    if (!price) return ['El precio es obligatorio'];
    if (!discountPrice) return ['El descuento es obligatorio'];
    if (!typePlan) return ['El tipo de plan es obligatorio'];
    if (!billingCycle) return ['El ciclo de facturación es obligatorio'];
    if (!features) return ['Las caracteristicas son obligatorios'];

    return [
      undefined,
      new PlanDto(
        name,
        price,
        discountPrice,
        typePlan,
        billingCycle,
        features,
        userLimit
      ),
    ];
  }
}