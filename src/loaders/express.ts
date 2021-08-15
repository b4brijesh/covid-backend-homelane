import express, { NextFunction, Request, Response } from 'express';
import routes from '../api';
import config from './config';
import logger from './logger';
import errors from '../utils/errors';
import { isCelebrateError } from 'celebrate';
import { isBoolean, values } from 'lodash';

export default (app: express.Application): void => {
  /**
   * Health Check endpoints
   */
  app.get('/status', (req: Request, res: Response) => {
    res.status(200).json({ error: false, message: 'Healthy server!' });
  });
  app.head('/status', (req: Request, res: Response) => {
    res.status(200).end();
  });

  // Useful if you're behind a reverse proxy (Heroku, AWS ELB, Nginx, etc)
  // It shows the real origin IP in the heroku or Cloudwatch logs
  app.enable('trust proxy');

  // Uncomment below to enable Cross Origin Resource Sharing to all origins by default if needed
  // app.use(cors());

  // Middleware that transforms the raw string of req.body into json
  app.use(express.json());
  app.use(express.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded into JSON body

  // Load API routes
  app.use(config.api.prefix, routes());

  //create 404 error if none of the routes match and forward to error handler
  app.use((req: Request, res: Response, next: NextFunction) => {
    logger.error(`Invalid URL: ${req.url}; method: ${req.method}`);
    const err = new errors.NotFoundError('Invalid URL');
    next(err);
  });

  //error handlers - should always be defined last

  // Handle expected errors
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    logger.error(`${err.name}: ${err.message}`);
    let errorHandled = false;

    if (isCelebrateError(err)) {
      const headersMessage = err.details.get('headers')?.message; // 'details' is a Map()
      const paramsMessage = err.details.get('params')?.message;
      const queryMessage = err.details.get('query')?.message;
      const bodyMessage = err.details.get('body')?.message;
      const errorMessage = headersMessage || paramsMessage || queryMessage || bodyMessage;
      res.status(400).json({ error: true, message: errorMessage || 'We were unable to validate your input' });
      errorHandled = true;
    }

    for (const expectedError of values(errors)) {
      if (err.name === expectedError.name) {
        res.status(err.status).json({ error: true, message: err.message });
        errorHandled = true;
      }
    }
    if (!errorHandled) {
      next(err); // forward to next error handler below
    }
  });

  // Handle all other errors
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    logger.error(err.stack); // log complete stack for unknown errors
    res.status(err.status || 500).json({ error: true, message: 'Something went wrong, please try again later' });
    // No next call needed after handling errors
  });
};
