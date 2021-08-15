import { celebrate, Joi, Segments } from 'celebrate';
import { Router, Request, Response, NextFunction } from 'express';
import logger from '../../loaders/logger';
import QueriesService from '../../services/queries';

const route = Router();

export default (app: Router): void => {
  app.use('/queries', route);

  const getDateInputSchema = {
    [Segments.QUERY]: {
      date: Joi.string().required(),
    },
  };
  route.get('/date', celebrate(getDateInputSchema), async (req: Request, res: Response, next: NextFunction) => {
    try {
      const date = req.query.date as string;
      const dateInfo = await new QueriesService().getDateInfo(date);
      res.status(200).json(dateInfo);
    } catch (error) {
      logger.error('Route error: %o', error);
      next(error);
    }
  });

  const getStateInputSchema = {
    [Segments.QUERY]: {
      state: Joi.string().required(),
    },
  };
  route.get('/state', celebrate(getStateInputSchema), async (req: Request, res: Response, next: NextFunction) => {
    try {
      const state = req.query.state as string;
      const stateInfo = await new QueriesService().getStateInfo(state);
      res.status(200).json(stateInfo);
    } catch (error) {
      logger.error('Route error: %o', error);
      next(error);
    }
  });

  const pinpointInputSchema = {
    [Segments.QUERY]: {
      date: Joi.string().required(),
      state: Joi.string().required(),
    },
  };
  route.get('/pinpoint', celebrate(pinpointInputSchema), async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { state, date } = req.query as { state: string; date: string; };
      const pinpointInfo = await new QueriesService().pinpointDateState(date, state);
      res.status(200).json(pinpointInfo);
    } catch (error) {
      logger.error('Route error: %o', error);
      next(error);
    }
  });
};
