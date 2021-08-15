import { Router } from 'express';
import queries from './routes/queries';

// guaranteed to get dependencies
export default (): Router => {
  const app = Router();
  queries(app);

  return app;
};
