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
    router.use('/api/team', TeamRoutes.routes);
    router.use('/api/inscription', InscriptionRoutes.routes);
    router.use('/api/tournament', TournamentRoutes.routes);
    
    return router;
  }
}
