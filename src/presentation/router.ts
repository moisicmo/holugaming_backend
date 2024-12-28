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
    router.use('/holu/team', TeamRoutes.routes);
    router.use('/holu/inscription', InscriptionRoutes.routes);
    router.use('/holu/tournament', TournamentRoutes.routes);
    
    return router;
  }
}
