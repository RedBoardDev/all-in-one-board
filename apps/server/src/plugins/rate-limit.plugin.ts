import type { FastifyInstance } from 'fastify';
import rateLimit from '@fastify/rate-limit';

export async function registerRateLimitPlugin(app: FastifyInstance): Promise<void> {
  const max = app.config.RATE_LIMIT_MAX;
  const timeWindowMs = app.config.RATE_LIMIT_TIME_WINDOW_MS;

  await app.register(rateLimit, {
    max,
    timeWindow: timeWindowMs,
    enableDraftSpec: true,
    errorResponseBuilder: (request, context) => {
      return {
        error: 'RATE_LIMIT_EXCEEDED',
        message: `Rate limit exceeded. Maximum ${max} requests per ${timeWindowMs / 1000} seconds.`,
        retryAfter: Math.ceil(context.ttl / 1000),
      };
    },
  });
}

