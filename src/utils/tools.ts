import {HttpError} from "../errorHandler/HttpError.js";
import {configuration} from "../config/emplConfig.js";
import {Employee, EmployeeDto, Roles} from "../model/Employee.js";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';


export const checkEmployeeId = (id: string | undefined) => {
    if (!id) throw new HttpError(400, "No ID in request");
    const _id = parseInt(id as string);
    if (!_id) throw new HttpError(400, "ID must be a number");
    return _id;
}
export const getJWT = (userId:number, roles:Roles[]) =>{
    const payload = {
        roles:JSON.stringify(roles)
    };
    const secret = configuration.jwt.secret;

    const options = {
        expiresIn:configuration.jwt.exp as any,
        subject:userId.toString()
    }

    return jwt.sign(payload, secret, options);
}

export const convertEmpDtoToEmployee = (dto:EmployeeDto):Employee => {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(dto.password, salt);
    return {
        id:uuidv4(),
        firstName:dto.firstName,
        lastName:dto.lastName,
        passHash:hash,
        roles: [Roles.CREW]
    }
}