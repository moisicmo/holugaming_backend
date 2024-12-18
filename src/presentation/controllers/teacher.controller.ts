import { Response, Request } from 'express';
import { CustomError, PaginationDto, TeacherDto } from '@/domain';
import { TeacherService } from '@/presentation';

export class TeacherController {
  constructor(private readonly teacherService: TeacherService) {}

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    console.log(`${error}`);
    return res.status(500).json({ error: 'Internal server error' });
  };

  getTeachers = async (req: Request, res: Response) => {
    const { page = 1, limit = 10 } = req.query;
    const [error, paginationDto] = PaginationDto.create(+page, +limit);
    if (error) return res.status(400).json({ error });

    this.teacherService
      .getTeachers(paginationDto!)
      .then((data) => res.json(data))
      .catch((error) => this.handleError(error, res));
  };

  createTeacher = (req: Request, res: Response) => {
    const [error, createTeacherDto] = TeacherDto.body(req.body);
    if (error) return res.status(400).json({ error });

    this.teacherService
      .createTeacher(createTeacherDto!, req.body.user)
      .then((data) => res.status(201).json(data))
      .catch((error) => this.handleError(error, res));
  };

  updateTeacher = (req: Request, res: Response) => {
    const [error, updateTeacherDto] = TeacherDto.body(req.body);
    if (error) return res.status(400).json({ error });

    this.teacherService
      .updateTeacher(updateTeacherDto!, req.body.user, parseInt(req.params.id))
      .then((data) => res.status(201).json(data))
      .catch((error) => this.handleError(error, res));
  };

  deleteTeacher = (req: Request, res: Response) => {
    this.teacherService
      .deleteTeacher(req.body.user, parseInt(req.params.id))
      .then((data) => res.status(201).json(data))
      .catch((error) => this.handleError(error, res));
  };
}
