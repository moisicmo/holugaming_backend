import { Router } from 'express';
import { AuthMiddleware, PermissionController, PermissionService } from '@/presentation';

export class PermissionRoutes {
  static get routes(): Router {

    const router = Router();
    const permissionService = new PermissionService();
    const controller = new PermissionController(permissionService);

    // rutas
    router.get( '/', [ AuthMiddleware.validateJWT ],controller.getPermissions );
    return router;
  }
}

