import { UserEntity } from '@/domain';

export class PlayerEntity extends UserEntity {
  constructor(
    public nick: string,
    user: UserEntity,
  ) {
    super(
      user.id,
      user.name,
      user.lastName,
      user.contacts,
      user.branches
    );
  }

  static fromObject(object: { [key: string]: any }) {
    const { nick, user } = object;

    const userEntity = UserEntity.fromObject(user);

    return new PlayerEntity(nick, userEntity);
  }
}
