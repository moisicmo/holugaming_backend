import { Router } from 'express';
import { AuthMiddleware, PlayerController, PlayerService } from '@/presentation';

export class PlayerRoutes {
  static get routes(): Router {
    const router = Router();
    const service = new PlayerService();
    const controller = new PlayerController(service);

    // rutas
    router.get('/', [AuthMiddleware.validateJWT], controller.getPlayers);
    router.post('/', controller.createPlayer);
    router.put('/:id', [AuthMiddleware.validateJWT], controller.updatePlayer);
    router.delete(
      '/:id',
      [AuthMiddleware.validateJWT],
      controller.deletePlayer
    );
    return router;
  }
}
