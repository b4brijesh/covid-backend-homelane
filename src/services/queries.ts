import { nSQL } from '@nano-sql/core';
import { ICasesModel, ITestsModel, IVaccinationsModel } from '../interfaces/tables';
import logger from '../loaders/logger';

export default class QueriesService {
  cases: string = 'cases';
  tests: string = 'tests';
  vaccinations: string = 'vaccinations';

  async getDateInfo(date: string): Promise<any> {
    logger.debug(`Fetching info for date: ${date}`);
    const cases= await nSQL(this.cases).query('select').where(['date', '=', date]).exec() as ICasesModel[];
    const tests = await nSQL(this.tests).query('select').where(['date', '=', date]).exec() as ITestsModel[];
    const vaccinations = await nSQL(this.vaccinations).query('select').where(['updatedOn', '=', date]).exec() as IVaccinationsModel[];

    return {
        cases,
        tests,
        vaccinations,
    };
  }

  async getStateInfo(state: string): Promise<any> {
    logger.debug(`Fetching info for state: ${state}`);
    const cases= await nSQL(this.cases).query('select').where(['state', '=', state]).exec() as ICasesModel[];
    const tests = await nSQL(this.tests).query('select').where(['state', '=', state]).exec() as ITestsModel[];
    const vaccinations = await nSQL(this.vaccinations).query('select').where(['state', '=', state]).exec() as IVaccinationsModel[];

    return {
        cases,
        tests,
        vaccinations,
    };
  }

  async pinpointDateState(date:string, state: string): Promise<any> {
    logger.debug(`Fetching info for date: ${date} & state: ${state}`);
    const cases= await nSQL(this.cases).query('select').where([['date', '=', date], 'AND', ['state', '=', state]]).exec() as ICasesModel[];
    const tests = await nSQL(this.tests).query('select').where([['date', '=', date], 'AND', ['state', '=', state]]).exec() as ITestsModel[];
    const vaccinations = await nSQL(this.vaccinations).query('select').where([['updatedOn', '=', date], 'AND', ['state', '=', state]]).exec() as IVaccinationsModel[];

    return {
        cases,
        tests,
        vaccinations,
    };
  }
}
