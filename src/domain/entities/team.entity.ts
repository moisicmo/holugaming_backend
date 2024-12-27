import { TeamToPlayerEntity } from '@/domain';

export class TeamEntity {
  constructor(
    public id: number,
    public name: string,
    public createdAt: Date,
    public teamToPlayers: TeamToPlayerEntity[],
    public shieldUrl?: string,

  ) { }

  static fromObject(object: { [key: string]: any; }) {
    const { id, name, createdAt, teamToPlayers, shieldUrl } = object;
    const teamToPlayerEntity = teamToPlayers ? teamToPlayers.map((e: TeamToPlayerEntity) => TeamToPlayerEntity.fromObject(e)) : [];

    return new TeamEntity(id, name, createdAt, teamToPlayerEntity, shieldUrl);
  }
}
