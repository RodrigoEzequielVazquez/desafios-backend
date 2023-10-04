import winston from 'winston';
import config from '../config.js';

const customLevelsOptions = {
    levels: {
        fatal: 0,
        error:1,
        warning:2,
        info:3,
        http:4,
        debug:5
    },
    colors: {
        fatal: 'black',
        error: 'red',
        warning: 'yellow',
        info: 'green',
        http: 'blue',
        debug: 'white'
    }
}

export const LEVELS = Object.keys(customLevelsOptions.levels)

const devLogger = winston.createLogger({
    levels: customLevelsOptions.levels,
    transports: [
        new winston.transports.Console({
            level: "debug",
            format: winston.format.combine(
                winston.format.colorize({colors: customLevelsOptions.colors}),
            )
        }),
    ]
})

const prodLogger = winston.createLogger({
    levels: customLevelsOptions.levels,
    transports: [
        new winston.transports.Console({
            level: "info", 
            format: winston.format.combine(
                winston.format.colorize({colors: customLevelsOptions.colors}),
                winston.format.simple()
        )
    }),
        new winston.transports.File({filename: './errors.log', level: 'error', format: winston.format.simple()})
    ]
})


export const loggerMiddleware = (req, res, next) => {
    req.logger = config.environment == 'PRODUCTION' ? prodLogger : devLogger;
    req.logger.debug(`${req.method} en ${req.url}`)
    next();
}