import supertest from 'supertest';
import { loadExpressApp } from '../../../src/handlers/api';

let app: Express.Application;
beforeAll(async () => {
  app = await loadExpressApp();
});

test('Query by date', async () => {
  const res = await supertest(app).get('/api/queries/date/?date=2020-01-30');
  expect(res.body.cases).toHaveLength(1);
});

test('Query by state', async () => {
  const res = await supertest(app).get('/api/queries/state/?state=Kerala');
  expect(res.body.cases).toHaveLength(3);
});

test('Pinpoint by state & date', async () => {
  const res = await supertest(app).get('/api/queries/pinpoint/?date=2020-01-30&state=Kerala');
  expect(res.body.cases).toHaveLength(1);
});
