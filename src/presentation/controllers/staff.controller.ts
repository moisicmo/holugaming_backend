import { Response, Request } from 'express';
import { CustomError, PaginationDto, StaffDto } from '@/domain';
import { StaffService } from '@/presentation';

export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    console.log(`${error}`);
    return res.status(500).json({ error: 'Internal server error' });
  };

  getStaffs = async (req: Request, res: Response) => {
    const { page = 1, limit = 10 } = req.query;
    const [error, paginationDto] = PaginationDto.create(+page, +limit);
    if (error) return res.status(400).json({ error });

    this.staffService
      .getStaffs(paginationDto!)
      .then((data) => res.json(data))
      .catch((error) => this.handleError(error, res));
  };

  createStaff = (req: Request, res: Response) => {
    const [error, createStaffDto] = StaffDto.body(req.body);
    if (error) return res.status(400).json({ error });

    this.staffService
      .createStaff(createStaffDto!, req.body.user)
      .then((data) => res.status(201).json(data))
      .catch((error) => this.handleError(error, res));
  };

  updateStaff = (req: Request, res: Response) => {
    const [error, updateStaffDto] = StaffDto.body(req.body);
    if (error) return res.status(400).json({ error });

    this.staffService
      .updateStaff(updateStaffDto!, req.body.user, parseInt(req.params.id))
      .then((data) => res.status(201).json(data))
      .catch((error) => this.handleError(error, res));
  };

  deleteStaff = (req: Request, res: Response) => {
    this.staffService
      .deleteStaff(req.body.user, parseInt(req.params.id))
      .then((data) => res.status(201).json(data))
      .catch((error) => this.handleError(error, res));
  };
}
