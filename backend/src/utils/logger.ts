import winston from 'winston'

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.colorize(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level}: ${message}`
    })
  ),
  transports: [
    // in production to save the error in files
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      maxsize: 10242880,
      maxFiles: 5,
    }),
    new winston.transports.File({
      filename: 'logs/combined.log',
      maxsize: 10242880,
      maxFiles: 5,
    }),
  ],
})

// in development to show the output in terminal
if (process.env.NODE_ENV === 'DEV') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  )
}

export default logger
