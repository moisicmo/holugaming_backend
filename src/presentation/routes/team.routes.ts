// TeamRoutes
import { Router } from 'express';
import { TeacherController, AuthMiddleware, TeacherService } from '@/presentation';

export class TeamRoutes {
  static get routes(): Router {
    const router = Router();
    const teacherService = new TeacherService();
    const controller = new TeacherController(teacherService);

    // rutas
    router.get('/', [AuthMiddleware.validateJWT], controller.getTeachers);
    // router.post('/', [AuthMiddleware.validateJWT], controller.createTeacher);
    // router.put('/:id', [AuthMiddleware.validateJWT], controller.updateTeacher);
    // router.delete(
    //   '/:id',
    //   [AuthMiddleware.validateJWT],
    //   controller.deleteTeacher
    // );
    return router;
  }
}
