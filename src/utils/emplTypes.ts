import e from "express";
import {Employee, Roles} from "../model/Employee.js";

export interface AuthRequest extends e.Request{
    userId?: string,
    firstName?: string,
    lastName?: string,
    roles?: Roles[];
}