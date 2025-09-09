import winston from "winston";
import {configuration} from "../src/config/emplConfig.js";


export const logger = winston.createLogger({
    level: configuration.loglevel,
    format: winston.format.json(),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({filename: 'error.log', level: 'error'}),
        new winston.transports.File({filename: 'combined.log', level: 'error'}),
    ]
})