import { PrismaClient } from '@prisma/client'
import { envs } from '@/config/envs';
import { Server } from '@/server';
import { AppRoutes } from '@/presentation/router';

async function main() {
  const prisma = new PrismaClient();

  const server = new Server({
    port: envs.PORT,
    routes: AppRoutes.routes,
  });

  try {
    await server.start();
  } catch (error) {
    console.error('Error starting the server:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
