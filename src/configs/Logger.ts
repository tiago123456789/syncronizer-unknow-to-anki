import winston, { format } from 'winston';

const logger = winston.createLogger({
    format: format.combine(
        format.timestamp(),
        format.json()
    ),
    transports: [
        new winston.transports.File({ dirname: "logs", filename: 'error.log', level: 'error' }),
        new winston.transports.File({ dirname: "logs", filename: 'info.log', level: 'info' }),
    ],
});

export default logger