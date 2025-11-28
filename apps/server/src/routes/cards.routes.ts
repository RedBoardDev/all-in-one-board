import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { allCards, cardsById } from '@aob/cards';
import { mapDomainErrorToHttpResponse } from '@aob/shared';

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
  app.get<{ Reply: CardListResponse }>(
    '/api/cards',
    {
      config: {
        rateLimit: false,
      },
    },
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
        refresh: card.refresh,
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
        const data = await Promise.resolve(card.getData());

        return reply.send({
          cardId,
          data,
          timestamp: Date.now(),
        });
      } catch (error) {
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

