import { Response, Request } from 'express';
import { BusinessDto, CustomError, PaginationDto } from '@/domain';
import { BusinessService } from '@/presentation';

export class BusinessController {
  constructor(private readonly businessService: BusinessService) {}

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    console.log(`${error}`);
    return res.status(500).json({ error: 'Internal server error' });
  };

  getBusiness = async (req: Request, res: Response) => {
    const { page = 1, limit = 10 } = req.query;
    const [error, paginationDto] = PaginationDto.create(+page, +limit);
    if (error) return res.status(400).json({ error });

    this.businessService
      .getBusiness(paginationDto!)
      .then((data) => res.json(data))
      .catch((error) => this.handleError(error, res));
  };

  createBusiness = (req: Request, res: Response) => {
    const [error, businessDto] = BusinessDto.body(req.body);
    if (error) return res.status(400).json({ error });

    this.businessService
      .createBusiness(businessDto!, req.body.user)
      .then((data) => res.status(201).json(data))
      .catch((error) => this.handleError(error, res));
  };

  updateBusiness = (req: Request, res: Response) => {
    const [error, businessDto] = BusinessDto.body(req.body);
    if (error) return res.status(400).json({ error });

    this.businessService
      .updateBusiness(businessDto!, req.body.user, parseInt(req.params.id))
      .then((data) => res.status(201).json(data))
      .catch((error) => this.handleError(error, res));
  };

  deleteBusiness = (req: Request, res: Response) => {
    this.businessService
      .deleteBusiness(req.body.user, parseInt(req.params.id))
      .then((data) => res.status(201).json(data))
      .catch((error) => this.handleError(error, res));
  };
}
