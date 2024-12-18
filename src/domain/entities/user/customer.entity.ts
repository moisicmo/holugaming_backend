import { UserEntity } from '@/domain';

export class CustomerEntity extends UserEntity {
  constructor(user: UserEntity) {
    super(
      user.id,
      user.name,
      user.lastName,
      user.contacts,
      user.branches
    );
  }
  
  static fromObject(object: { [key: string]: any }) {
    const { user } = object;

    const userEntity = UserEntity.fromObject(user);

    return new CustomerEntity(userEntity);
  }
}
