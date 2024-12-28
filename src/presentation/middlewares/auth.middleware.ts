import { NextFunction, Request, Response } from 'express';
import { JwtAdapter } from '@/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class AuthMiddleware {
  static async validateJWT( req: Request, res: Response, next: NextFunction ) : Promise<any> {

    const authorization = req.header('Authorization');
    if( !authorization ) return res.status(401).json({ error: 'No token provided' });
    if ( !authorization.startsWith('Bearer ') ) return res.status(401).json({ error: 'Invalid Bearer token' });
    const token = authorization.split(' ').at(1) || '';
    try {
      const payload = await JwtAdapter.validateToken<{ id: number }>(token);
      if ( !payload ) return res.status(401).json({ error: 'Invalid token' })
      // const user = await prisma.users.findFirst({
      //   where: {
      //     id: payload.id 
      //   }
      // });
      // if ( !user ) return res.status(401).json({ error: 'Invalid token - user' });
      // req.body.user = UserEntity.fromObjectAuth(user);
      next();
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}



// export class AuthMiddleware {
//   static async validateJWT(req: Request, res: Response, next: NextFunction): Promise<void> {
//     const authorization = req.header('Authorization');
//     if (!authorization) {
//       res.status(401).json({ error: 'No token provided' });
//       return;
//     }

//     if (!authorization.startsWith('Bearer ')) {
//       res.status(401).json({ error: 'Invalid Bearer token' });
//       return;
//     }

//     const token = authorization.split(' ').at(1) || '';

//     try {
//       const payload = await JwtAdapter.validateToken<{ id: number }>(token);
//       if (!payload) {
//         res.status(401).json({ error: 'Invalid token' });
//         return;
//       }

//       const user = await prisma.users.findFirst({
//         where: {
//           id: payload.id,
//         },
//       });

//       if (!user) {
//         res.status(401).json({ error: 'Invalid token - user' });
//         return;
//       }

//       req.body.user = UserEntity.fromObjectAuth(user);
//       next();
//     } catch (error) {
//       console.log(error);
//       res.status(500).json({ error: 'Internal server error' });
//     }
//   }
// }
