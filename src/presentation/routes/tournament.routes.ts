import { Router } from 'express';
import { AuthMiddleware, InscriptionService, InscriptionController, TournamentService, TournamentController } from '@/presentation';
export class TournamentRoutes {
  static get routes(): Router {
    const router = Router();
    const service = new TournamentService();
    const controller = new TournamentController(service);

    // rutas
    router.get('/', controller.getTournaments);
    router.get('/:id', controller.getTournamentById);
    router.post('/', [AuthMiddleware.validateJWT], controller.createTournament);
    router.put('/:id', [AuthMiddleware.validateJWT], controller.updateTournament);
    return router;
  }
}
