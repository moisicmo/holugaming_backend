import { Role } from '@prisma/client';

export class TeamToPlayerEntity {
  constructor(
    public playerId: number,
    public role: Role,
    public nick: string,

  ) { }

  static fromObject(object: { [key: string]: any; }) {
    const { playerId, role, nick } = object;
    return new TeamToPlayerEntity(playerId, role, nick);
  }
}
