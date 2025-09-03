import * as mongoose from "mongoose";
import {Roles} from "./Employee.js";
import { v4 as uuidv4 } from 'uuid';


const employeeMongooseSchema = new mongoose.Schema({
    firstName: {type:String, required:true},
    lastName: {type:String, required:true},
    passHash: {type:String, required:true},
    id: {type: String, default: () => uuidv4()},
    role: {type:[String], enum: Roles, required:true}
})

export const EmployeeModel = mongoose.model('Employee', employeeMongooseSchema, 'employee_collection')