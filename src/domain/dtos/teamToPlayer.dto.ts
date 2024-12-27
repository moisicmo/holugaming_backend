import { Role } from '@prisma/client';

export class TeamToPlayerDto {

  private constructor(
    public readonly playerId: number,
    public readonly role: Role,
    public readonly nick: string,
  ) { }


  static body(object: { [key: string]: any }): [string?, TeamToPlayerDto?] {

    const { playerId, role, nick } = object;

    if (!playerId) return ['El id del jugador es obligatorio'];
    if (!role) return ['El rol es obligatorio'];
    if (!nick) return ['El nick es obligatorio'];

    return [undefined, new TeamToPlayerDto(playerId, role, nick)];

  }

}