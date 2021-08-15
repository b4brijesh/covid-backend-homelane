import dayjs from 'dayjs';
import logger from './logger';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import utc from 'dayjs/plugin/utc'; // dependent on utc plugin
import timezone from 'dayjs/plugin/timezone';
import relativeTime from 'dayjs/plugin/relativeTime';
import loadDatabase from './database';

// Load everything common across lambda handlers here
export const initializeEnvironment = async (): Promise<void> => {
  // TODO: Add why we are doing below
  dayjs.extend(localizedFormat);
  dayjs.extend(utc);
  dayjs.extend(timezone);
  dayjs.extend(relativeTime);
  dayjs.tz.setDefault('Asia/Kolkata');

  // Load database connection client
  await loadDatabase();
  logger.debug('Database loaded');
};
