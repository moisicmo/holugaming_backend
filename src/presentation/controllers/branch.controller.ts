import { Response, Request } from 'express';
import { BranchDto, CustomError, PaginationDto } from '@/domain';
import { BranchService } from '@/presentation';

export class BranchController {
  constructor(private readonly branchService: BranchService) {}

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    console.log(`${error}`);
    return res.status(500).json({ error: 'Internal server error' });
  };

  getBranches = async (req: Request, res: Response) => {
    const { page = 1, limit = 10 } = req.query;
    const [error, paginationDto] = PaginationDto.create(+page, +limit);
    if (error) return res.status(400).json({ error });

    this.branchService
      .getBranches(paginationDto!)
      .then((branches) => res.json(branches))
      .catch((error) => this.handleError(error, res));
  };

  createBranch = (req: Request, res: Response) => {
    const [error, branchDto] = BranchDto.body(req.body);
    if (error) return res.status(400).json({ error });

    this.branchService
      .createBranch(branchDto!, req.body.user)
      .then((branch) => res.status(201).json(branch))
      .catch((error) => this.handleError(error, res));
  };

  updateBranch = (req: Request, res: Response) => {
    const [error, branchDto] = BranchDto.body(req.body);
    if (error) return res.status(400).json({ error });

    this.branchService
      .updateBranch(branchDto!, req.body.user, parseInt(req.params.id))
      .then((branch) => res.status(201).json(branch))
      .catch((error) => this.handleError(error, res));
  };

  deleteBranch = (req: Request, res: Response) => {
    this.branchService
      .deleteBranch(req.body.user, parseInt(req.params.id))
      .then((branch) => res.status(201).json(branch))
      .catch((error) => this.handleError(error, res));
  };
}
