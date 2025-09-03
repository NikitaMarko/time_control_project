import e from "express";
import {Roles} from "../model/Employee.js";

export interface AuthRequest extends e.Request{
    userId?: string,
    firstName?: string,
    lastName?: string,
    roles?: Roles[];
}