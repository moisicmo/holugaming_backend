import { Router } from 'express';

import {
  Authroutes,
  BranchRoutes,
  BusinessRoutes,
  PlayerRoutes,
  PermissionRoutes,
  PlanRoutes,
  RoleRoutes,
  StaffRoutes,
  StudentRoutes,
  SubscriptionRoutes,
  TeacherRoutes,
  TutorRoutes,
} from '@/presentation';

export class AppRoutes {
  static get routes(): Router {
    const router = Router();

    // Definir las rutas
    router.use('/api/auth', Authroutes.routes);
    router.use('/api/staff', StaffRoutes.routes);
    router.use('/api/student', StudentRoutes.routes);
    router.use('/api/teacher', TeacherRoutes.routes);
    router.use('/api/customer', PlayerRoutes.routes);
    router.use('/api/tutor', TutorRoutes.routes);
    router.use('/api/player', PlayerRoutes.routes);

    router.use('/api/role', RoleRoutes.routes);
    router.use('/api/permission', PermissionRoutes.routes);
    router.use('/api/business', BusinessRoutes.routes);
    router.use('/api/branch', BranchRoutes.routes);
    router.use('/api/subscription', SubscriptionRoutes.routes);
    router.use('/api/plan', PlanRoutes.routes);
    
    return router;
  }
}
