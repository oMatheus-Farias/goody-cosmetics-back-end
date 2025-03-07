import { PrismaClient } from '@prisma/client';
import Fastify from 'fastify';
import { ZodError } from 'zod';

import { env } from './configs/env';
import { categoriesRoutes, usersRoutes } from './http/routes';

export const app = Fastify();

export const prisma = new PrismaClient();

app.register(categoriesRoutes, {
  prefix: '/api/categories',
});
app.register(usersRoutes, {
  prefix: '/api/users',
});

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({ error: error.errors[0].message });
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error);
  }

  reply.status(500).send({ error: 'Internal server error' });
});
