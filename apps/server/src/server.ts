import Fastify, { type FastifyInstance } from 'fastify';
import { registerEnvPlugin } from './plugins/env.plugin.js';
import { registerSecurityPlugins } from './plugins/security.plugin.js';
import { registerCorsPlugin } from './plugins/cors.plugin.js';
import { registerRateLimitPlugin } from './plugins/rate-limit.plugin.js';
import { registerCardRoutes } from './routes/cards.routes.js';

export async function createServer(): Promise<FastifyInstance> {
  const app = Fastify({
    logger: {
        transport: {
          target: '@fastify/one-line-logger',
          options: {
            colorize: true,
        },
      },
    },
  });

  await registerEnvPlugin(app);

  await registerSecurityPlugins(app);
  await registerCorsPlugin(app);

  await registerRateLimitPlugin(app);

  await registerCardRoutes(app);

  app.get('/health', async () => ({ status: 'ok', timestamp: Date.now() }));

  return app;
}

export async function startServer(): Promise<FastifyInstance> {
  const app = await createServer();

  const port = app.config.PORT;
  const host = app.config.HOST;

  try {
    await app.listen({ port, host });
    app.log.info(`Server listening on http://${host}:${port}`);
    return app;
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

