import { Router } from 'express';

import {
  InscriptionRoutes,
  TeamRoutes,
  TournamentRoutes
} from '@/presentation';

export class AppRoutes {
  static get routes(): Router {
    const router = Router();

    // Definir las rutas
    router.use('/holu/api/team', TeamRoutes.routes);
    router.use('/holu/api/inscription', InscriptionRoutes.routes);
    router.use('/holu/api/tournament', TournamentRoutes.routes);
    
    return router;
  }
}
