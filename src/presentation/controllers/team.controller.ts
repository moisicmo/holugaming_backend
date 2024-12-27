import { Response, Request } from 'express';
import { CustomError, PaginationDto, TeamDto } from '@/domain';
import { TeamService } from '@/presentation';

export class TeamController {
  constructor(private readonly service: TeamService) {}

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    console.log(`${error}`);
    return res.status(500).json({ error: 'Internal server error' });
  };

  getTeams = async (req: Request, res: Response) => {
    const { page = 1, limit = 10 } = req.query;
    const [error, paginationDto] = PaginationDto.create(+page, +limit);
    if (error) return res.status(400).json({ error });

    this.service
      .getTeams(paginationDto!)
      .then((data) => res.json(data))
      .catch((error) => this.handleError(error, res));
  };

  createTeam = (req: Request, res: Response) => {
    const [error, dto] = TeamDto.body(req.body);
    if (error) return res.status(400).json({ error });

    this.service
      .createTeam(dto!, req.body.user)
      .then((data) => res.status(201).json(data))
      .catch((error) => this.handleError(error, res));
  };

  updateTeam = (req: Request, res: Response) => {
    const [error, dto] = TeamDto.body(req.body);
    if (error) return res.status(400).json({ error });

    this.service
      .updateTeam(dto!, req.body.user, parseInt(req.params.id))
      .then((data) => res.status(201).json(data))
      .catch((error) => this.handleError(error, res));
  };

  deleteTeam = (req: Request, res: Response) => {
    this.service
      .deleteTeam(req.body.user, parseInt(req.params.id))
      .then((data) => res.status(201).json(data))
      .catch((error) => this.handleError(error, res));
  };
}
