import { Router } from 'express';
import { AuthMiddleware, BusinessService, BusinessController } from '@/presentation';

export class BusinessRoutes {
  static get routes(): Router {
    const router = Router();
    const businessService = new BusinessService();
    const controller = new BusinessController(businessService);

    // rutas
    router.get('/', [AuthMiddleware.validateJWT], controller.getBusiness);
    router.post('/', [AuthMiddleware.validateJWT], controller.createBusiness);
    router.put('/:id', [AuthMiddleware.validateJWT], controller.updateBusiness);
    router.delete(
      '/:id',
      [AuthMiddleware.validateJWT],
      controller.deleteBusiness
    );
    return router;
  }
}
