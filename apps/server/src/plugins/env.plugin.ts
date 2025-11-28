import type { FastifyInstance } from 'fastify';
import env from '@fastify/env';

/**
 * * Environment variables schema and validation
 *
 * Centralizes all environment variable configuration with validation.
 * Variables are accessible via app.config after registration.
 */
export interface EnvSchema {
  PORT: number;
  HOST: string;
  NODE_ENV: 'development' | 'production' | 'test';
  CORS_ORIGINS?: string;
  RATE_LIMIT_MAX: number;
  RATE_LIMIT_TIME_WINDOW_MS: number;
}

declare module 'fastify' {
  interface FastifyInstance {
    config: EnvSchema;
  }
}

export async function registerEnvPlugin(app: FastifyInstance): Promise<void> {
  await app.register(env, {
    schema: {
      type: 'object',
      required: ['PORT', 'HOST', 'NODE_ENV'],
      properties: {
        PORT: {
          type: 'number',
          default: 3001,
        },
        HOST: {
          type: 'string',
          default: '0.0.0.0',
        },
        NODE_ENV: {
          type: 'string',
          enum: ['development', 'staging', 'production'],
          default: 'development',
        },
        CORS_ORIGINS: {
          type: 'string',
        },
        RATE_LIMIT_MAX: {
          type: 'number',
          default: 100,
        },
        RATE_LIMIT_TIME_WINDOW_MS: {
          type: 'number',
          default: 60000,
        },
      },
    },
    dotenv: true,
  });
}

