import {Employee, EmployeeDto, Roles, SavedFiredEmployee} from "../model/Employee.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import {HttpError} from "../errorHandler/HttpError.js";
import { v4 as uuidv4 } from 'uuid';
import {FiredEmployeeModel} from "../model/EmployeeMongooseSchema.js";
import {configuration} from "../config/emplConfig.js";



function generateTabNumber() {
    return "TAB-" + Date.now()
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

export const convertEmpDtoToEmployee = (dto:EmployeeDto) => {
    const employee:Employee = {
        firstName:dto.firstName,
        lastName:dto.lastName,
        _id:uuidv4(),
        table_num:generateTabNumber(),
        roles:Roles.CREW,
        hash:bcrypt.hashSync(dto.password, 10)
    }
    return employee;
};
export const convertEmployeeToFiredEmployee = (emp:Employee) =>{
    const firedEmpl:SavedFiredEmployee = {
        firstName:emp.firstName,
        lastName:emp.lastName,
        _id:emp._id,
        table_num:emp.table_num,
        fireDate:new Date().toDateString()
    }
    return firedEmpl;
}
export const checkRole = (role:string) => {
    const newRole = Object.values(Roles).find(r => r === role)
    if(!newRole) throw new HttpError(400, "Wrong role!");
    return newRole;
}
export const generateShiftId = () =>
    Math.trunc(Math.random()*10000) + 1;

export const checkFiredEmployees = async(id:string) => {
    if(await FiredEmployeeModel.findOne({id}))
        throw new HttpError(409,  "This employee was fired");
}
