import { RoleEntity, UserEntity } from '@/domain';

export class StaffAuthEntity {
  constructor(public id: number, public role?: RoleEntity) {}
  static fromObject(object: { [key: string]: any }) {
    const { id, role } = object;
    return new StaffAuthEntity(id, RoleEntity.fromObject(role));
  }
}

export class StaffEntity extends UserEntity {
  constructor(id: number, user: UserEntity, public role?: RoleEntity) {
    super(user.id, user.name, user.lastName, user.contacts, user.branches);
    this.id = id;
  }
  static fromObject(object: { [key: string]: any }) {
    const { id, role, user } = object;

    const roleEntity = role ? RoleEntity.fromObject(role) : undefined;
    const userEntity = UserEntity.fromObject(user);

    return new StaffEntity(id, userEntity, roleEntity);
  }
}
