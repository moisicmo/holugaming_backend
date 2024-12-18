import { Response, Request } from 'express';
import { CustomError, PaginationDto, TutorDto } from '@/domain';
import { TutorService } from '@/presentation';

export class TutorController {
  constructor(private readonly service: TutorService) {}

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    console.log(`${error}`);
    return res.status(500).json({ error: 'Internal server error' });
  };

  getTutors = async (req: Request, res: Response) => {
    const { page = 1, limit = 10 } = req.query;
    const [error, paginationDto] = PaginationDto.create(+page, +limit);
    if (error) return res.status(400).json({ error });

    this.service
      .getTutors(paginationDto!)
      .then((data) => res.json(data))
      .catch((error) => this.handleError(error, res));
  };

  createTutor = (req: Request, res: Response) => {
    const [error, createTeacherDto] = TutorDto.body(req.body);
    if (error) return res.status(400).json({ error });

    this.service
      .createTutor(createTeacherDto!, req.body.user)
      .then((data) => res.status(201).json(data))
      .catch((error) => this.handleError(error, res));
  };

  updateTutor = (req: Request, res: Response) => {
    const [error, updateTeacherDto] = TutorDto.body(req.body);
    if (error) return res.status(400).json({ error });

    this.service
      .updateTutor(updateTeacherDto!, req.body.user, parseInt(req.params.id))
      .then((data) => res.status(201).json(data))
      .catch((error) => this.handleError(error, res));
  };

  deleteTutor = (req: Request, res: Response) => {
    this.service
      .deleteTutor(req.body.user, parseInt(req.params.id))
      .then((data) => res.status(201).json(data))
      .catch((error) => this.handleError(error, res));
  };
}
