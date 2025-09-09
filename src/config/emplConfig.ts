import dotenv from "dotenv";
import appConf from "../../app-config/app-config.json";



export interface AppConfig {
    port: number,
    skipRoutes:string[],
    pathRoles:Record<string, string[]>,
    checkIdRoutes:string[],
    db:string,
    jwt:{
        secret:string,
        exp:string|number
    },
    "loglevel":string

}

dotenv.config();

export const configuration:AppConfig ={
    ...appConf,
    db:process.env.db || "dev db address",
    jwt:{
        secret:process.env.JWT_SECRET || "super-secret",
        exp:process.env.JWT_EXP || "1h"
    }
}