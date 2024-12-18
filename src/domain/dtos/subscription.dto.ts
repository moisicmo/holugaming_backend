export class SubscriptionDto {
  private constructor(
    public readonly businessId: number,
    public readonly planId: number,
  ) {}

  static body(object: { [key: string]: any }): [string?, SubscriptionDto?] {
    const {
      businessId,
      planId,
    } = object;

    if (!businessId) return ['El id del negocio es obligatorio'];
    if (!planId) return ['El id del plan es obligatorio'];

    return [
      undefined,
      new SubscriptionDto(
        businessId,
        planId,
      ),
    ];
  }
}