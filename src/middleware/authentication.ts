import {AccountService} from "../services/accountService.js";
import {NextFunction, Request, Response} from "express";
import {checkReaderId} from "../utils/tools.js";
import bcrypt from "bcryptjs";
import {HttpError} from "../errorHandler/HttpError.js";
import {AuthRequest, Roles} from "../utils/libTypes.js";
import jwt, {JwtPayload} from "jsonwebtoken";
import {configuration} from "../config/libConfig.js";

const BASIC = "Basic ";
const BEARER = "Bearer ";


async function getBasicAuth(authHeader: string, service: AccountService, req: AuthRequest, res: Response) {

    const auth = Buffer.from(authHeader.substring(BASIC.length), "base64").toString("ascii");
    console.log(auth);

    const [id, password] = auth.split(":");
    const _id = checkReaderId(id);
    console.log(process.env.OWNER!)
    console.log(process.env.OWNER_PASS)
    if (_id == (+process.env.OWNER!) && password === process.env.OWNER_PASS) {
        req.userId = 10000000;
        req.roles = [Roles.SUPERVISOR];
    } else {
        try {
            const account = await service.getAccountById(_id);
            if (bcrypt.compareSync(password, account.passHash)) {
                req.userId = account._id;
                req.userName = account.userName;
                req.roles = account.roles;
                console.log("AUTHENTICATED")
            } else {
                console.log("NOT AUTHENTICATED")
            }
        } catch (e) {
            console.log("NOT AUTHENTICATED because Internal Http Errors")
        }
    }
}

function jwtAuth(authHeader: string, req: AuthRequest) {
    const token = authHeader.substring(BEARER.length);
    try {
        const payload = jwt.verify(token, configuration.jwt.secret) as JwtPayload;
        console.log(payload);
        req.userId = +payload.sub!;
        req.roles = JSON.parse(payload.roles) as Roles[];
        req.userName = "Anonymous"
    } catch (e) {
        console.log("Reader not AUTHENTICATED by JWToken")
    }
}

export const authenticate = (service: AccountService) => {
        return async (req: Request, res: Response, next: NextFunction) => {
            const authHeader = req.header('Authorization');
            if (authHeader && authHeader.startsWith(BASIC))
                await getBasicAuth(authHeader, service, req, res);
            else if(authHeader && authHeader.startsWith(BEARER))
                jwtAuth(authHeader, req)
            next();
        }
    }


export const skipRoutes = (skipRoutes: string[]) =>
    (req: AuthRequest, res: Response, next: NextFunction) => {
        const route = req.method + req.path;
        if (!skipRoutes.includes(route) && !req.userId)
            throw new HttpError(401, "skipRoutes sent throw this error");
        if (skipRoutes.some(r => route.startsWith(r) || req.path.startsWith(r))) {
            return next();
        }

        next();
    }