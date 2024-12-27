import { Game_type } from '@prisma/client';

export class GameEntity {
  constructor(
    public id: number,
    public name: string,
    public type: Game_type,
    
  ) { }

  static fromObject(object: { [key: string]: any; }) {
    const { id, name, type } = object;
    return new GameEntity(id, name, type);
  }
}
