import { Router } from 'express';
import { AuthMiddleware, TeamController, TeamService } from '@/presentation';
export class TeamRoutes {
  static get routes(): Router {
    const router = Router();
    const service = new TeamService();
    const controller = new TeamController(service);

    // rutas
    router.get('/', [AuthMiddleware.validateJWT], controller.getTeams);
    router.post('/', [AuthMiddleware.validateJWT], controller.createTeam);
    router.put('/:id', [AuthMiddleware.validateJWT], controller.updateTeam);
    router.delete('/:id', [AuthMiddleware.validateJWT], controller.deleteTeam);
    return router;
  }
}
