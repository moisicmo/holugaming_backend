export class TournamentDto {

  private constructor(
    public readonly gameId: number,
    public readonly name: string,
    public readonly numberTeams: number,
    public readonly start: Date,
    public readonly end: Date,
    public readonly inscriptionCost: number,
    public readonly playerCount: number,
    public readonly substituteCount: number,
  ) { }


  static body(object: { [key: string]: any }): [string?, TournamentDto?] {

    const { gameId, name, numberTeams, start, end, inscriptionCost, playerCount, substituteCount } = object;

    if (!gameId) return ['El id del torneo es obligatorio'];
    if (!name) return ['El nombre del torneo es obligatorio'];
    if (!numberTeams) return ['El nombre del torneo es obligatorio'];
    if (!start) return ['El nombre del torneo es obligatorio'];
    if (!end) return ['El nombre del torneo es obligatorio'];
    if (!inscriptionCost) return ['El nombre del torneo es obligatorio'];
    if (!playerCount) return ['El nombre del torneo es obligatorio'];
    if (!substituteCount) return ['El nombre del torneo es obligatorio'];

    return [undefined, new TournamentDto(gameId, name, numberTeams, start, end, inscriptionCost, playerCount, substituteCount)];

  }

}