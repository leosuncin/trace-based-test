import cors from 'cors';
import express from 'express';
import paginate from 'express-paginate';

import { env } from './config/env';
import authRoutes from './controllers/auth';
import * as db from './lib/db';
import { handleExceptions, handleServerExit } from './lib/error';
import { routeNotFound } from './middleware/route-not-found';
import { serverError } from './middleware/server-error';
import { validationError } from './middleware/validation-error';

const app = express();

app
  .use(express.urlencoded({ extended: true }))
  .use(express.json())
  .use(paginate.middleware(10, 50))
  .use(
    cors({
      origin: env.ALLOWED_ORIGINS.split(/\s*,\s*/),
    }),
  );

app.get('/health', (_, response) => {
  const state = db.status();
  const isUp = state === 'connected';

  response.status(isUp ? 200 : 503).json({
    status: isUp ? 'up' : 'down',
    db: state,
  });
});

app.use('/api', authRoutes);

app.use(routeNotFound).use(validationError).use(serverError);

async function bootstrap() {
  await db.connect(env.MONGO_URL);

  const server = app.listen(env.PORT, () => {
    console.log(`🚀 Listening at http://localhost:${env.PORT}`);
  });

  server.on('error', handleExceptions);

  process.on('unhandledRejection', handleExceptions);
  process.on('uncaughtException', handleExceptions);
  process.on('SIGINT', handleServerExit('SIGINT', server));
  process.on('SIGTERM', handleServerExit('SIGTERM', server));
}

if (require.main === module) {
  void bootstrap();
}

export default app;
