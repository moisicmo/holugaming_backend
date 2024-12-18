import { Response, Request } from 'express';
import { CustomError, PaginationDto, PlayerDto } from '@/domain';
import { PlayerService } from '@/presentation';

export class PlayerController {
  constructor(private readonly service: PlayerService) {}

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    console.log(`${error}`);
    return res.status(500).json({ error: 'Internal server error' });
  };

  getPlayers = async (req: Request, res: Response) => {
    const { page = 1, limit = 10 } = req.query;
    const [error, paginationDto] = PaginationDto.create(+page, +limit);
    if (error) return res.status(400).json({ error });

    this.service
      .getPlayers(paginationDto!)
      .then((data) => res.json(data))
      .catch((error) => this.handleError(error, res));
  };

  createPlayer = (req: Request, res: Response) => {
    const [error, playerDto] = PlayerDto.body(req.body);
    if (error) return res.status(400).json({ error });

    this.service
      .createPlayer(playerDto!, req.body.user)
      .then((data) => res.status(201).json(data))
      .catch((error) => this.handleError(error, res));
  };

  updatePlayer = (req: Request, res: Response) => {
    const [error, playerDto] = PlayerDto.body(req.body);
    if (error) return res.status(400).json({ error });

    this.service
      .updatePlayer(playerDto!, req.body.user, parseInt(req.params.id))
      .then((data) => res.status(201).json(data))
      .catch((error) => this.handleError(error, res));
  };

  deletePlayer = (req: Request, res: Response) => {
    this.service
      .deletePlayer(req.body.user, parseInt(req.params.id))
      .then((data) => res.status(201).json(data))
      .catch((error) => this.handleError(error, res));
  };
}
