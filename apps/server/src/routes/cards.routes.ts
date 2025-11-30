import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { allCards, cardsById, batchFetchers, defaultPolicies } from '@aob/cards';
import { mapDomainErrorToHttpResponse } from '@aob/shared';
import { ApiGatewayService, RateLimitedError } from '../services/api-gateway.service.js';

interface CardParams {
  cardId: string;
}

interface CardListResponse {
  cards: Array<{
    id: string;
    title: string;
    layout: {
      minW: number;
      minH: number;
      defaultW: number;
      defaultH: number;
      maxW?: number;
      maxH?: number;
    };
    refresh?: {
      intervalMs?: number;
      enableGlobalRefresh?: boolean;
      skipInitialFetch?: boolean;
    };
  }>;
}

interface CardDataResponse {
  cardId: string;
  data: unknown;
  timestamp: number;
}

interface ErrorResponse {
  error: string;
  message: string;
  cardId?: string;
}

export async function registerCardRoutes(app: FastifyInstance): Promise<void> {
  const loggerAdapter = {
    debug: (msg: string, meta?: unknown) => app.log.debug(meta ?? {}, msg),
    info: (msg: string, meta?: unknown) => app.log.info(meta ?? {}, msg),
    warn: (msg: string, meta?: unknown) => app.log.warn(meta ?? {}, msg),
    error: (msg: string, meta?: unknown, err?: unknown) => app.log.error(meta ?? {}, msg, err),
  };

  const apiGateway = new ApiGatewayService({
    defaultPolicies,
    batchFetchers,
    logger: loggerAdapter,
  });

  app.get<{ Reply: CardListResponse }>(
    '/api/cards',
    async (_request: FastifyRequest, reply: FastifyReply<{ Reply: CardListResponse }>) => {
      const cardsList = allCards.map(card => ({
        id: card.id.toValue(),
        title: card.title,
        layout: {
          minW: card.layout.minW,
          minH: card.layout.minH,
          defaultW: card.layout.defaultW,
          defaultH: card.layout.defaultH,
          maxW: card.layout.maxW,
          maxH: card.layout.maxH,
        },
      }));

      return reply.send({ cards: cardsList });
    }
  );

  app.get<{ Params: CardParams; Reply: CardDataResponse | ErrorResponse }>(
    '/api/cards/:cardId',
    async (
      request: FastifyRequest<{ Params: CardParams }>,
      reply: FastifyReply<{ Reply: CardDataResponse | ErrorResponse }>
    ) => {
      const { cardId } = request.params;

      const card = cardsById.get(cardId);
      if (!card) {
        return reply.status(404).send({
          error: 'CARD_NOT_FOUND',
          message: `Card with id '${cardId}' not found`,
        });
      }

      try {
        const data = await apiGateway.fetchCardData(card);

        return reply.send({
          cardId,
          data,
          timestamp: Date.now(),
        });
      } catch (error) {
        if (error instanceof RateLimitedError) {
          return reply.status(429).send({
            error: 'RATE_LIMITED',
            message: error.message,
            cardId,
          });
        }

        const httpError = mapDomainErrorToHttpResponse(
          error instanceof Error ? error : new Error(String(error))
        );

        app.log.error({ cardId, error }, 'Failed to fetch card data');

        return reply.status(httpError.statusCode).send({
          error: 'FETCH_ERROR',
          message: httpError.message,
          cardId,
        });
      }
    }
  );
}
