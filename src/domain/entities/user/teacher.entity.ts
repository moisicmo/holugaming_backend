import { UserEntity } from '@/domain';

export class TeacherAuthEntity {
  constructor(
    public id: number,
  ) { }
  static fromObject(object: { [key: string]: any }) {
    const { id } = object;
    return new TeacherAuthEntity(id);
  }
}

export class TeacherEntity extends UserEntity {

  constructor(id: number, user: UserEntity) {
    super(user.id, user.name, user.lastName, user.contacts, user.branches);
    this.id = id;
  }
  static fromObject(object: { [key: string]: any }) {
    const { id, user } = object;

    const userEntity = UserEntity.fromObject(user);

    return new TeacherEntity(id, userEntity);
  }
}