import type { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';

export async function registerCorsPlugin(app: FastifyInstance): Promise<void> {
  const allowedOrigins = app.config.CORS_ORIGINS?.split(',') ?? [
    'http://localhost:5173',
    'http://localhost:4173',
  ];

  await app.register(cors, {
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });
}

