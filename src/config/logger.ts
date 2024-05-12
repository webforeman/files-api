import * as winston from 'winston'
import DailyRotateFile from 'winston-daily-rotate-file'

const consoleFormat = winston.format.combine(
  winston.format.colorize({
    all: false, // Highlighting the entire message text
    colors: { info: 'blue', warn: 'yellow', error: 'red', debug: 'green' }, // Setting colors for levels
  }),
  winston.format.printf(({ level, message, service, timestamp }) => {
    return `[${level}] ${timestamp} ${service}: ${message}`
  })
)

const fileFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.printf(({ level, message, service, timestamp }) => {
    return `[${level}] ${timestamp} ${service}: ${message}`
  })
)

export const logger = winston.createLogger({
  // Log only if the level is lower (i.e. more serious) or equal to this
  level: 'info',
  format: winston.format.combine(
    winston.format((info) => {
      info.level = info.level.toUpperCase()
      return info
    })(),
    winston.format.timestamp(),
    winston.format.errors({ stack: true })
  ),
  defaultMeta: { service: 'files-api-service' },

  transports: [
    // --
    // - Record all logs with the importance level "error" in "error.log"
    // - Record all logs with the importance level "info" or lower in "combined.log"
    // --
    new winston.transports.Console({
      format: consoleFormat,
    }),
    new DailyRotateFile({
      filename: 'logs/error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '128m',
      maxFiles: '14d',
      level: 'error',
      format: fileFormat,
    }),
  ],
})
