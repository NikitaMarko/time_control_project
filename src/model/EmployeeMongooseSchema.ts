import * as mongoose from "mongoose";
import {Roles} from "./Employee.js";
import { v4 as uuidv4 } from 'uuid';


const employeeMongooseSchema = new mongoose.Schema({
    _id: { type: String, default: () => uuidv4() },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    passHash: { type: String, required: true },
    roles: { type: [String], enum: Object.values(Roles), required: true },
    wasActiveWorking: {
        type: [
            {
                start: { type: Date, required: true },
                end: { type: Date, required: false }
            }
        ],
        default: []
    }
}, { _id: false });


export const EmployeeModel = mongoose.model('Employee', employeeMongooseSchema, 'employee_collection')