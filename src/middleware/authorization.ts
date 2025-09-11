import {RequestHandler} from "express";
import {AuthRequest} from "../utils/emplTypes.js";
import {Roles} from "../model/Employee.js";
import {HttpError} from "../errorHandler/HttpError.js";

// export const authorize = (pathRoles: Record<string, Roles[]>): RequestHandler => {
//     return (req, res, next) => {
//         const authReq = req as AuthRequest;
//         const roles = authReq.roles;
//
//         const routePath = req.route?.path;
//         const routeKey = req.method + req.baseUrl + (routePath || req.path);
//
//         if (!roles || !Array.isArray(roles) || !pathRoles[routeKey]?.some(r => roles.includes(r))) {
//             throw new HttpError(403, "Forbidden");
//         }
//         next();
//     };
// };
//


export  const checkAccountById = (checkPathId:string[]): RequestHandler => {
        return (req, res, next)=> {
            const authReq = req as AuthRequest;
            const route = authReq.method + authReq.path;
            const roles = authReq.roles;
            const isCheckedRoute = checkPathId.includes(route);
            const isManager = roles?.includes(Roles.MNG);
            const isHR = roles?.includes(Roles.HR);
            const isCrew = roles?.includes(Roles.CREW);
            const isOwnAccount = authReq.userId === authReq.body.id;

            if (
                !roles || !isCheckedRoute || isManager || isHR || (isCrew && isOwnAccount)
            ) {
                return next();
            }
            else return next (new HttpError(403, "You can modify only your own account"))
        }
    }