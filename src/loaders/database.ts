import logger from './logger';
import { nSQL } from '@nano-sql/core';
import fs from 'fs';
import config from './config';

async function createDatabase() {
  await nSQL().createDatabase({
    id: 'covid',
    mode: 'PERM', // save changes to IndexedDB, WebSQL or SnapDB!
    tables: [
      {
        name: 'cases',
        model: {
          'sno:int': { pk: true },
          'date:string': {},
          'time:string': {},
          'state:string': {},
          'confirmedIndians:int': {},
          'confirmedForeigners:int': {},
          'cured:int': {},
          'deaths:int': {},
          'confirmed:int': {},
        },
      },
      {
        name: 'tests',
        model: {
          'date:string': {},
          'state:string': {},
          'totalSamples:int': {},
          'negativeSamples:int': {},
          'positiveSamples:int': {},
        },
      },
      {
        name: 'vaccinations',
        model: {
          'updatedOn:string': {},
          'state:string': {},
          'totalDosesAdministered:int': {},
          'totalSessionsConducted:int': {},
          'totalSites:int': {},
          'firstDoseAdministered:int': {},
          'secondDoseAdministered:int': {},
          'malesVaccinated:int': {},
          'femalesVaccinated:int': {},
          'transgendersVaccinated:int': {},
          'totalCovaxinAdministered:int': {},
          'totalCoviShieldAdministered:int': {},
          'totalSputnikVAdministered:int': {},
          'aefi:int': {},
          'underFortyFive:int': {},
          'fortyFiveToSixty:int': {},
          'aboveSixty:int': {},
          'totalIndividualsVaccinated:int': {},
        }
      }
    ],
  });
}

async function loadData() {
  let covidCases: string, covidTests: string, covidVaccinations: string;
  if (config.nodeEnv === 'test') {
    covidCases = fs.readFileSync(`${__dirname}/../../tests/test-data/cases.csv`).toString();
    covidTests = fs.readFileSync(`${__dirname}/../../tests/test-data/tests.csv`).toString();
    covidVaccinations = fs.readFileSync(`${__dirname}/../../tests/test-data/vaccinations.csv`).toString();
  } else {
    covidCases = fs.readFileSync(`${__dirname}/../data/cases.csv`).toString();
    covidTests = fs.readFileSync(`${__dirname}/../data/tests.csv`).toString();
    covidVaccinations = fs.readFileSync(`${__dirname}/../data/vaccinations.csv`).toString();
  }
  
  await nSQL('cases').loadCSV(covidCases, row => {
    const dbRow = {
      sno: parseInt(row.Sno),
      date: row.Date,
      time: row.Time,
      state: row['State/UnionTerritory'],
      confirmedIndians: parseInt(row.ConfirmedIndianNational) || 0,
      confirmedForeigners: parseInt(row.ConfirmedForeignNational) || 0,
      cured: parseInt(row.Cured) || 0,
      deaths: parseInt(row.Deaths) || 0,
      confirmed: parseInt(row.Confirmed) || 0,
    };
    return dbRow;
  }, (progress) => {
    if (progress % 10 == 0) {
      logger.debug(`Loading cases: ${progress}`) // when progress === 1 the import is done
    }
  });
  await nSQL('tests').loadCSV(covidTests, row => {
    const dbRow = {
      date: row.Date,
      state: row.State,
      totalSamples: parseInt(row.TotalSamples) || 0,
      negativeSamples: parseInt(row.Negative) || 0,
      positiveSamples: parseInt(row.Positive) || 0,
    };
    return dbRow;
  }, (progress) => {
    if (progress % 10 == 0) {
      logger.debug(`Loading tests: ${progress}`) // when progress === 1 the import is done
    }
  });
  await nSQL('vaccinations').loadCSV(covidVaccinations, row => {
    const dbRow = {
      updatedOn: row['Updated On'],
      state: row['State'],
      totalDosesAdministered: parseInt(row['Total Doses Administered']),
      totalSessionsConducted: parseInt(row['Total Sessions Conducted']),
      totalSites: parseInt(row['Total Sites']),
      firstDoseAdministered: parseInt(row['First Dose Administered']),
      secondDoseAdministered: parseInt(row['Second Dose Administered']),
      malesVaccinated: parseInt(row['Male(Individuals Vaccinated)']),
      femalesVaccinated: parseInt(row['Female(Individuals Vaccinated)']),
      transgendersVaccinated: parseInt(row['Transgender(Individuals Vaccinated)']),
      totalCovaxinAdministered: parseInt(row['Total Covaxin Administered']),
      totalCoviShieldAdministered: parseInt(row['Total CoviShield Administered']),
      totalSputnikVAdministered: parseInt(row['Total Sputnik V Administered']),
      aefi: parseInt(row['AEFI']),
      underFortyFive: parseInt(row['18-45 years (Age)']),
      fortyFiveToSixty: parseInt(row['45-60 years (Age)']),
      aboveSixty: parseInt(row['60+ years (Age)']),
      totalIndividualsVaccinated: parseInt(row['Total Individuals Vaccinated']),
    };
    return dbRow;
  }, (progress) => {
    if (progress % 10 == 0) {
      logger.debug(`Loading vaccinations: ${progress}`) // when progress === 1 the import is done
    }
  });
}

export default async function loadDatabase() {
  await createDatabase();
  logger.debug('Database created');
  await loadData();
  logger.debug('Data loaded');
  // (await nSQL('cases').query('select').exec()).map(row => logger.debug(row));
  // (await nSQL('tests').query('select').exec()).map(row => logger.debug(row));
  // (await nSQL('vaccinations').query('select').exec()).map(row => logger.debug(row));
}
