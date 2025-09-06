import * as mongoose from "mongoose";
import {Employee, Roles} from "./Employee.js";
import { v4 as uuidv4 } from 'uuid';


export const EmployeeMongoSchema = new mongoose.Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    _id: { type: String, default: () => uuidv4() },
    table_num:{type:String, required: true},
    roles:{type:String, enum: Roles, required: true},
    hash:{type:String, required: true},
})

export const EmployeeModel = mongoose.model<Employee>('Employees', EmployeeMongoSchema, 'employees_accounting')

export const FiredEmployeeMongoSchema = new mongoose.Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    _id: { type: String, default: () => uuidv4() },
    table_num:{type:String, required: true},
    fireDate: {type:String, required: true}
})

export const FiredEmployeeModel = mongoose.model('Fired', FiredEmployeeMongoSchema, 'fired_emp_collection')