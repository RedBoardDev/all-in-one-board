import type { FastifyInstance, FastifyRequest } from 'fastify';
import rateLimit from '@fastify/rate-limit';

/**
 * * Generates a unique key for rate limiting per card
 *
 * Creates a key based on HTTP method and the actual cardId from the URL.
 * This ensures each card has its own independent rate limit counter.
 * Example: GET /api/cards/clock -> "GET:/api/cards/clock"
 */
function generateCardKey(request: FastifyRequest): string {
  const method = request.method;
  const pathname = request.url.split('?')[0];
  return `${method}:${pathname}`;
}

export async function registerRateLimitPlugin(app: FastifyInstance): Promise<void> {
  const max = app.config.RATE_LIMIT_MAX;
  const timeWindowMs = app.config.RATE_LIMIT_TIME_WINDOW_MS;

  await app.register(rateLimit, {
    max,
    timeWindow: timeWindowMs,
    enableDraftSpec: true,
    keyGenerator: generateCardKey,
    errorResponseBuilder: (request, context) => {
      const pathname = request.url.split('?')[0];
      const cardId = pathname.startsWith('/api/cards/')
        ? pathname.replace('/api/cards/', '')
        : undefined;

      return {
        error: 'RATE_LIMIT_EXCEEDED',
        message: `Rate limit exceeded for card '${cardId || 'unknown'}'. Maximum ${max} requests per ${timeWindowMs / 1000} seconds.`,
        retryAfter: Math.ceil(context.ttl / 1000),
        endpoint: pathname,
        cardId,
      };
    },
  });
}

