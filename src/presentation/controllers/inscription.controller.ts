import { Response, Request } from 'express';
import { CustomError, PaginationDto, InscriptionDto } from '@/domain';
import { InscriptionService } from '@/presentation';

export class InscriptionController {
  constructor(private readonly service: InscriptionService) {}

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    console.log(`${error}`);
    return res.status(500).json({ error: 'Internal server error' });
  };

  getInscriptions = async (req: Request, res: Response) => {
    const { page = 1, limit = 10 } = req.query;
    const [error, paginationDto] = PaginationDto.create(+page, +limit);
    if (error) return res.status(400).json({ error });

    this.service
      .getInscriptions(paginationDto!)
      .then((data) => res.json(data))
      .catch((error) => this.handleError(error, res));
  };

  createInscription = (req: Request, res: Response) => {
    const [error, dto] = InscriptionDto.body(req.body);
    if (error) return res.status(400).json({ error });

    this.service
      .createInscription(dto!)
      .then((data) => res.status(201).json(data))
      .catch((error) => this.handleError(error, res));
  };


}
