import { BranchEntity, ContactEntity, StaffAuthEntity, StudentAuthEntity, TeacherAuthEntity, TypeDocument, CustomError } from '@/domain';

export class UserEntity {
  constructor(
    public id: number,
    public name: string,
    public lastName: string,
    public contacts: ContactEntity[],
    public branches?: BranchEntity[],
    public numberDocument?: string,
    public typeDocument?: TypeDocument,
    public image?: string,
    public staffs?: StaffAuthEntity,
    public students?: StudentAuthEntity,
    public teachers?: TeacherAuthEntity,
  ) { }

  static fromObjectAuth(object: { [key: string]: any }) {
    const {
      id,
      name,
      lastName,
      contacts,
      branches,
      numberDocument,
      typeDocument,
      image,
      staff,
      student,
      teacher,
    } = object;

    if (!id) throw CustomError.badRequest('Falta id');
    if (!name) throw CustomError.badRequest('Falta el nombre');
    if (!lastName) throw CustomError.badRequest('Falta el apellido');

    const contactEntity = contacts ? contacts.map((e: ContactEntity) => ContactEntity.fromObject(e)) : undefined;
    const branchesEntity = branches ? branches.map((e: BranchEntity) => BranchEntity.fromObject(e)) : undefined;
    const staffAuthEntity = staff ? StaffAuthEntity.fromObject(staff) : undefined;
    const studentAuthEntity = student ? StudentAuthEntity.fromObject(student) : undefined;
    const teacherAuthEntity = teacher ? TeacherAuthEntity.fromObject(teacher) : undefined;



    return new UserEntity(
      id,
      name,
      lastName,
      contactEntity,
      branchesEntity,
      numberDocument,
      typeDocument,
      image,
      staffAuthEntity,
      studentAuthEntity,
      teacherAuthEntity,
    );
  }

  static fromObject(object: { [key: string]: any }) {
    const { id, name, lastName, contacts, branches } = object;

    if (!id) throw CustomError.badRequest('Falta id');
    if (!name) throw CustomError.badRequest('Falta el nombre');
    if (!lastName) throw CustomError.badRequest('Falta el apellido');
    const contactEntity = contacts ? contacts.map((e: ContactEntity) => ContactEntity.fromObject(e)) : undefined;
    const branchEntity = branches ? branches.map((e: BranchEntity) => BranchEntity.fromObject(e)) : undefined;

    return new UserEntity(id, name, lastName, contactEntity, branchEntity);
  }
}
