import {NextFunction, Request, Response} from "express";
import {accountEmplServiceMongo} from "../services/AccountServiceImplMongo.js";
import {Employee, EmployeeDto, EmployeeUpdates} from "../model/Employee.js";
import {convertEmpDtoToEmployee} from "../utils/tools.js";


export const changePassword = async (req: Request, res: Response,next:NextFunction) => {
    try {
        const {empId, newPassword} = req.body;
        await accountEmplServiceMongo.changePassword(empId, newPassword);
        res.status(201).send(`Password for user ${empId} has changed successfully`);
    } catch (e) {
        next(e)
    }
};

export const fireEmployee = async (req: Request, res: Response) => {
        const id = req.params.empId;
        const result = await accountEmplServiceMongo.fireEmployee(id);
        res.json(result);
};

export const updateEmployee = async (req: Request, res: Response,next:NextFunction) => {
    try {
        const body: EmployeeDto = req.body;
        const empId = req.params.empId as string;
        const result = await accountEmplServiceMongo.updateEmployee(empId, body);

        const empUpd:EmployeeUpdates = {
            firstName:result.firstName,
            lastName:result.lastName
        }
        res.json(empUpd);
    } catch (e) {
        next(e)
    }
}

export const hireEmployee = async (req: Request, res: Response) => {
        const body = req.body;
        const employee: Employee = convertEmpDtoToEmployee(body as EmployeeDto);
        const result = await accountEmplServiceMongo.hireEmployee(employee);
        res.status(201).json(result);
};

export const getEmployeeById = async (req: Request, res: Response) => {
        const id = req.params.id;
        const result = await accountEmplServiceMongo.getEmployeeById(id as string);
        res.status(200).json(result)
};

export const getAllEmployees = async (req: Request, res: Response) => {
    const temp = await accountEmplServiceMongo.getAllEmployees();
    res.json(temp);
};

export const setRole = async (req: Request, res: Response,next:NextFunction) => {
    try {
        const { id, newRole } = req.params;
        const employeeWithNewRole = await accountEmplServiceMongo.setRole(id, newRole);
        res.status(200).json(employeeWithNewRole);
    } catch (err) {
        next(err);
    }
};