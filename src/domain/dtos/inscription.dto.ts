export class InscriptionDto {

  private constructor(
    public readonly tournamentId: number,
    public readonly teamId: number,
  ) { }


  static body(object: { [key: string]: any }): [string?, InscriptionDto?] {

    const { tournamentId, teamId } = object;

    if (!tournamentId) return ['El id del torneo es obligatorio'];
    if (!teamId) return ['El id del team es obligatorio'];

    return [undefined, new InscriptionDto(tournamentId, teamId)];

  }

}