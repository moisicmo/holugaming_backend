import { Response, Request } from 'express';
import { CustomError, PaginationDto, StudentDto } from '@/domain';
import { StudentService } from '@/presentation';

export class StudentController {
  constructor(private readonly stutdentService: StudentService) {}

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    console.log(`${error}`);
    return res.status(500).json({ error: 'Internal server error' });
  };

  getStudents = async (req: Request, res: Response) => {
    const { page = 1, limit = 10 } = req.query;
    const [error, paginationDto] = PaginationDto.create(+page, +limit);
    if (error) return res.status(400).json({ error });

    this.stutdentService
      .getStudents(paginationDto!)
      .then((data) => res.json(data))
      .catch((error) => this.handleError(error, res));
  };

  createStudent = (req: Request, res: Response) => {
    const [error, createStudentDto] = StudentDto.body(req.body);
    if (error) return res.status(400).json({ error });

    this.stutdentService
      .createStudent(createStudentDto!, req.body.user)
      .then((data) => res.status(201).json(data))
      .catch((error) => this.handleError(error, res));
  };

  updateStudent = (req: Request, res: Response) => {
    const [error, updateStudentDto] = StudentDto.body(req.body);
    if (error) return res.status(400).json({ error });

    this.stutdentService
      .updateStudent(updateStudentDto!, req.body.user, parseInt(req.params.id))
      .then((data) => res.status(201).json(data))
      .catch((error) => this.handleError(error, res));
  };

  deleteStudent = (req: Request, res: Response) => {
    this.stutdentService
      .deleteStudent(req.body.user, parseInt(req.params.id))
      .then((data) => res.status(201).json(data))
      .catch((error) => this.handleError(error, res));
  };
}
