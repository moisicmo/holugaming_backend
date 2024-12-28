import { Router } from 'express';
import { AuthMiddleware, InscriptionService, InscriptionController } from '@/presentation';
export class InscriptionRoutes {
  static get routes(): Router {
    const router = Router();
    const service = new InscriptionService();
    const controller = new InscriptionController(service);

    // rutas
    router.get('/', [AuthMiddleware.validateJWT], controller.getInscriptions);
    router.post('/', [AuthMiddleware.validateJWT], controller.createInscription);
    return router;
  }
}
