import { UserEntity } from '@/domain';

export class TutorAuthEntity {
  constructor(public id: number) {}
  static fromObject(object: { [key: string]: any }) {
    const { id } = object;
    return new TutorAuthEntity(id);
  }
}



export class TutorEntity extends UserEntity {
  public readonly id:number;
  public readonly address: string;

  constructor(id: number, user: UserEntity, address: string) {
    super(user.id, user.name, user.lastName, user.contacts, user.branches, undefined, undefined, undefined); // Pasa phone aquí
    this.id = id;
    this.address = address;
  }

  static fromObject(object: { [key: string]: any }) {
    const { id, address, user } = object;

    const userEntity = UserEntity.fromObject(user);

    return new TutorEntity(id, userEntity, address);
  }
}
