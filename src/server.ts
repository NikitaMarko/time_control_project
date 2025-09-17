import fs from "node:fs";
import {configuration} from "./config/emplConfig.js";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import {errorHandler} from "./errorHandler/errorHandler.js";
import {employeeRouter} from "./routes/emplRouter.js";
import {shiftCtrlRouter} from "./routes/shiftCtrlRouter.js";
import swaggerUi from "swagger-ui-express";
import swaggerDoc from "../docs/openapi.json" with { type: 'json' };


export const launchServer = () => {
    //===========load environments==============
    dotenv.config();
    const app = express();

    const logStream = fs.createWriteStream('access.log', {flags:'a'});
//==================Middleware================

    app.use(morgan('dev'));
    app.use(morgan('combined', {stream:logStream}))
    app.use(express.json());
    // app.use(queryLimiter);
    // app.use(authenticate(accountServiceMongo));
    // app.use(skipRoutes(configuration.skipRoutes));
    // app.use(authorize(configuration.pathRoles as Record<string, Roles[]>));
    // app.use(checkAccountById(configuration.checkIdRoutes));
//============Swagger Docs================
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc,{
        swaggerOptions:{
            supportedSubmitMethods:[]
        }
    }));
//==================Router====================
    app.use('/employee', employeeRouter)
    app.use('/shift', shiftCtrlRouter)
    app.use((req, res) => {
        res.status(404).send("Page not found")
    })

//================ErrorHandler================
    app.use(errorHandler)
//============================================
    app.listen(configuration.port, () => console.log(`Server runs at http://localhost:${configuration.port}`));
}