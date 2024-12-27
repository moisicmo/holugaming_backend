import { GameEntity, InscriptionEntity } from '@/domain';

export class TournamentEntity {
  constructor(
    public id: number,
    public name: string,
    public numberTeams: number,
    public start: Date,
    public end: Date,
    public inscriptionCost: number,
    public playerCount: number,
    public substituteCount: number,
    public inscriptions: InscriptionEntity[],
    public game?: GameEntity,


  ) { }

  static fromObject(object: { [key: string]: any; }) {
    const { id, name, numberTeams, start, end, inscriptionCost, playerCount, substituteCount,inscriptions, game } = object;
    const inscriptionEntity = inscriptions ? inscriptions.map((e: InscriptionEntity) => InscriptionEntity.fromObject(e)) : undefined;
    const gameEntity = game ? GameEntity.fromObject(game) : undefined;



    return new TournamentEntity(id, name, numberTeams, start, end, inscriptionCost, playerCount, substituteCount, inscriptionEntity, gameEntity);
  }
}
