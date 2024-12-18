import { Response, Request } from 'express';
import { CustomerDto, CustomError, PaginationDto } from '@/domain';
import { CustomerService } from '@/presentation';

export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    console.log(`${error}`);
    return res.status(500).json({ error: 'Internal server error' });
  };

  getCustomers = async (req: Request, res: Response) => {
    const { page = 1, limit = 10 } = req.query;
    const [error, paginationDto] = PaginationDto.create(+page, +limit);
    if (error) return res.status(400).json({ error });

    this.customerService
      .getCustomers(paginationDto!)
      .then((data) => res.json(data))
      .catch((error) => this.handleError(error, res));
  };

  createCustomer = (req: Request, res: Response) => {
    const [error, createCustomerDto] = CustomerDto.body(req.body);
    if (error) return res.status(400).json({ error });

    this.customerService
      .createCustomer(createCustomerDto!, req.body.user)
      .then((data) => res.status(201).json(data))
      .catch((error) => this.handleError(error, res));
  };

  updateCustomer = (req: Request, res: Response) => {
    const [error, updateCustomerDto] = CustomerDto.body(req.body);
    if (error) return res.status(400).json({ error });

    this.customerService
      .updateCustomer(updateCustomerDto!, req.body.user, parseInt(req.params.id))
      .then((data) => res.status(201).json(data))
      .catch((error) => this.handleError(error, res));
  };

  deleteCustomer = (req: Request, res: Response) => {
    this.customerService
      .deleteCustomer(req.body.user, parseInt(req.params.id))
      .then((data) => res.status(201).json(data))
      .catch((error) => this.handleError(error, res));
  };
}
