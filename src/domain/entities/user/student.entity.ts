import { EducationLevel } from '@prisma/client';
import { Gender, TutorEntity, UserEntity } from '@/domain';

export class StudentAuthEntity {
  constructor(public id: number, public code: string) {}
  static fromObject(object: { [key: string]: any }) {
    const { id, code } = object;
    return new StudentAuthEntity(id, code);
  }
}

export class StudentEntity extends UserEntity {
  public readonly code: string;
  public readonly birthdate: Date;
  public readonly gender: Gender;
  public readonly school: string;
  public readonly grade: number;
  public readonly educationLevel: EducationLevel;
  public tutors?: TutorEntity[];

  constructor(
    id: number,
    code: string,
    birthdate: Date,
    gender: Gender,
    school: string,
    grade: number,
    educationLevel: EducationLevel,
    user: UserEntity,
    tutors?: TutorEntity[]
  ) {
    super(user.id, user.name, user.lastName, user.contacts, user.branches);
    this.id = id;
    this.code = code;
    this.birthdate = birthdate;
    this.gender = gender;
    this.school = school;
    this.grade = grade;
    this.educationLevel = educationLevel;
    this.tutors = tutors;
  }
  static fromObject(object: { [key: string]: any }) {
    const {
      id,
      code,
      birthdate,
      gender,
      school,
      grade,
      educationLevel,
      user,
      tutors,
    } = object;

    const tutorsEntity = tutors
      ? tutors.map((e: TutorEntity) => TutorEntity.fromObject(e))
      : undefined;

    const userEntity = UserEntity.fromObject(user);

    return new StudentEntity(
      id,
      code,
      birthdate,
      gender,
      school,
      grade,
      educationLevel,
      userEntity,
      tutorsEntity
    );
  }
}
