import { TeamEntity } from '@/domain';

export class InscriptionEntity {
  constructor(
    public id: number,
    public isPayment: boolean,
    public team?: TeamEntity,

  ) { }

  static fromObject(object: { [key: string]: any; }) {
    const { id, isPayment, team } = object;
    const teamEntity = team ? TeamEntity.fromObject(team) : undefined;

    return new InscriptionEntity(id, isPayment, teamEntity);
  }
}
