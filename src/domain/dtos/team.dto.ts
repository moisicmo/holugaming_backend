import { TeamToPlayerDto } from '@/domain';

export class TeamDto {

  private constructor(
    public readonly gameId: number,
    public readonly name: string,
    public readonly players: TeamToPlayerDto[],
  ) { }


  static body(object: { [key: string]: any }): [string?, TeamDto?] {

    const { gameId, name, players } = object;

    if (!gameId) return ['El id del juego es obligatorio'];
    if (!name) return ['El nombre es obligatorio'];
    if (!players) return ['Los Jugadores son obligatorios'];

    return [undefined, new TeamDto(gameId, name, players)];

  }

}