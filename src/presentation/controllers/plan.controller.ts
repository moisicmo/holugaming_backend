import { Response, Request } from 'express';
import { CustomError, PaginationDto, PlanDto } from '@/domain';
import { PlanService } from '@/presentation';

export class PlanController {
  constructor(private readonly planService: PlanService) {}

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    console.log(`${error}`);
    return res.status(500).json({ error: 'Internal server error' });
  };

  getPlans = async (req: Request, res: Response) => {
    const { page = 1, limit = 10 } = req.query;
    const [error, paginationDto] = PaginationDto.create(+page, +limit);
    if (error) return res.status(400).json({ error });

    this.planService
      .getPlans(paginationDto!)
      .then((data) => res.json(data))
      .catch((error) => this.handleError(error, res));
  };

  createPlan = (req: Request, res: Response) => {
    const [error, planDto] = PlanDto.body(req.body);
    if (error) return res.status(400).json({ error });

    this.planService
      .createPlan(planDto!, req.body.user)
      .then((data) => res.status(201).json(data))
      .catch((error) => this.handleError(error, res));
  };

  updatePlan = (req: Request, res: Response) => {
    const [error, planDto] = PlanDto.body(req.body);
    if (error) return res.status(400).json({ error });

    this.planService
      .updatePlan(planDto!, req.body.user, parseInt(req.params.id))
      .then((data) => res.status(201).json(data))
      .catch((error) => this.handleError(error, res));
  };

  deletePlan = (req: Request, res: Response) => {
    this.planService
      .deletePlan(req.body.user, parseInt(req.params.id))
      .then((data) => res.status(201).json(data))
      .catch((error) => this.handleError(error, res));
  };
}
