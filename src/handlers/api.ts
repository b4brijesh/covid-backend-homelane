import config from '../loaders/config';
import logger from '../loaders/logger';
import { initializeEnvironment } from '../loaders';
import express from 'express';
import expressLoader from '../loaders/express';

if (config.nodeEnv !== 'test') {
  // For stacktrace errors in TS instead of JS
  // Jest doesn't play well with source-map-support, hence it is dynamically imported
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('source-map-support').install(); // eslint-disable-line @typescript-eslint/no-unsafe-call
}

export const loadExpressApp = async (): Promise<express.Application> => {
  logger.debug(`Loading environment: ${config.nodeEnv}`);
  await initializeEnvironment();
  logger.debug('Loading Express app!');
  const app = express();
  expressLoader(app);
  logger.debug('Express loaded!');
  return app;
};

const startServer = (app: express.Application): void => {
  app
    .listen(config.port, () => {
      logger.debug(`Server listening on port: ${config.port}!`);
    })
    .on('error', err => {
      logger.error(err);
      process.exit(1);
    });
};

async function runLocally() {
  if (config.nodeEnv === 'local') {
    logger.debug('Starting server!');
    const app = await loadExpressApp();
    startServer(app);
  }
}

runLocally();
