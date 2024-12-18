import { Response, Request } from 'express';
import { CustomError, PaginationDto, SubscriptionDto } from '@/domain';
import { SubscriptionService } from '@/presentation';

export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    console.log(`${error}`);
    return res.status(500).json({ error: 'Internal server error' });
  };

  getSubcriptions = async (req: Request, res: Response) => {
    const { page = 1, limit = 10 } = req.query;
    const [error, paginationDto] = PaginationDto.create(+page, +limit);
    if (error) return res.status(400).json({ error });

    this.subscriptionService
      .getSubscriptions(paginationDto!)
      .then((data) => res.json(data))
      .catch((error) => this.handleError(error, res));
  };

  createSubscription = (req: Request, res: Response) => {
    const [error, subscriptionDto] = SubscriptionDto.body(req.body);
    if (error) return res.status(400).json({ error });

    this.subscriptionService
      .createSubscription(subscriptionDto!, req.body.user)
      .then((data) => res.status(201).json(data))
      .catch((error) => this.handleError(error, res));
  };

  updateSubscription = (req: Request, res: Response) => {
    const [error, subscriptionDto] = SubscriptionDto.body(req.body);
    if (error) return res.status(400).json({ error });

    this.subscriptionService
      .updateSubscription(subscriptionDto!, req.body.user, parseInt(req.params.id))
      .then((data) => res.status(201).json(data))
      .catch((error) => this.handleError(error, res));
  };

  deleteSubscription = (req: Request, res: Response) => {
    this.subscriptionService
      .deleteSubscription(req.body.user, parseInt(req.params.id))
      .then((data) => res.status(201).json(data))
      .catch((error) => this.handleError(error, res));
  };
}
