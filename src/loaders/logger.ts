import winston from 'winston';
import config from './config';

const localLogFormat = winston.format.combine(winston.format.cli(), winston.format.splat());

const remoteLogFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD hh:mm:ss.SSS A Z' }),
  winston.format.errors({ stack: true }), // add stack-trace to errors
  winston.format.splat(), // for string interpolation
  winston.format.json(), // for JSON formatting
);

const transports: winston.transports.ConsoleTransportInstance[] = [];
if (config.nodeEnv === 'local' || config.nodeEnv === 'test') {
  transports.push(new winston.transports.Console({ format: localLogFormat }));
} else {
  transports.push(new winston.transports.Console({ format: remoteLogFormat }));
}

const logger = winston.createLogger({
  level: config.logs.level, // minimum priority log to print
  levels: winston.config.npm.levels,
  transports,
  exceptionHandlers: transports,
});

export default logger;
