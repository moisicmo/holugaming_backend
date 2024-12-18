import { UserDto, EducationLevel, Gender } from '@/domain';

export class StudentDto extends UserDto {
  constructor(
    public tutors: number[],
    public birthdate: Date,
    public gender: Gender,
    public school: string,
    public grade: number,
    public educationLevel: EducationLevel,
    userDto: UserDto
  ) {
    super( userDto.name, userDto.lastName, userDto.typeContact, userDto.data);
  }

  static body(object: { [key: string]: any }): [string?, StudentDto?] {
    const {
      tutors,
      birthdate,
      gender,
      school,
      grade,
      educationLevel,
      ...userData
    } = object;

    if (!tutors) return ['es necesario almenos un tutor'];
    if (!birthdate) return ['es necesario la fecha de nacimiento'];
    if (!gender) return ['es necesario el genero'];
    if (!school) return ['es necesario la escuela'];
    if (!grade) return ['es necesario el grado'];
    if (!educationLevel) return ['es necesario el nivel de educación'];
    const [error, userDto] = UserDto.body(userData);
    if (error) return [error];

    return [
      undefined,
      new StudentDto(
        tutors,
        birthdate,
        gender,
        school,
        grade,
        educationLevel,
        userDto!
      ),
    ];
  }
}