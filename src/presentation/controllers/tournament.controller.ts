import { Response, Request } from 'express';
import { CustomError, PaginationDto, TournamentDto } from '@/domain';
import { TournamentService } from '@/presentation';

export class TournamentController {
  constructor(private readonly service: TournamentService) {}

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    console.log(`${error}`);
    return res.status(500).json({ error: 'Internal server error' });
  };

  getTournaments = async (req: Request, res: Response) => {
    const { page = 1, limit = 10 } = req.query;
    const [error, paginationDto] = PaginationDto.create(+page, +limit);
    if (error) return res.status(400).json({ error });

    this.service
      .getTournaments(paginationDto!)
      .then((data) => res.json(data))
      .catch((error) => this.handleError(error, res));
  };

  getTournamentById = async (req: Request, res: Response) => {
    this.service
      .getTournamentById(parseInt(req.params.id))
      .then((data) => res.status(201).json(data))
      .catch((error) => this.handleError(error, res));
  };

  createTournament = (req: Request, res: Response) => {
    const [error, dto] = TournamentDto.body(req.body);
    if (error) return res.status(400).json({ error });

    this.service
      .createTournament(dto!)
      .then((data) => res.status(201).json(data))
      .catch((error) => this.handleError(error, res));
  };


}
