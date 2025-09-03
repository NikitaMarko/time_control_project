import {Request,Response} from "express";
import {accountEmplServiceMongo} from "../services/AccountServiceImplMongo.js";
import {Employee, EmployeeDto, Roles} from "../model/Employee.js";
import {convertEmpDtoToEmployee} from "../utils/tools.js";

export const changePassword = async (req: Request, res: Response) => {
    const {empId, newPassword} = req.body;
    await accountEmplServiceMongo.changePassword(empId, newPassword);
    res.status(204).send();
};
export const fireEmployee = async (req: Request, res: Response) => {
    const id = req.params.id;
    const result = await accountEmplServiceMongo.fireEmployee(id);
    res.json(result)
};
export const updateEmployee = async (req: Request, res: Response) => {
    try {
        const empId = req.params.empId;
        const employeeDto: EmployeeDto = req.body;

        const updatedEmployee = await accountEmplServiceMongo.updateEmployee(empId, employeeDto);

        res.status(200).json(updatedEmployee)
    } catch (error) {
        console.log(error);
    }
}
export const hireEmployee = async (req: Request, res: Response) => {
    const body = req.body;
    const employee:Employee = convertEmpDtoToEmployee(body as EmployeeDto);
    await accountEmplServiceMongo.hireEmployee(employee);
    res.status(201).send();
};
export const getEmployeeById = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const result = await accountEmplServiceMongo.getEmployeeById(id);
        const {passHash, ...safeEmp} = result;
        res.status(200).send(safeEmp);
    } catch (e) {
        console.log(e)
    }
};
export const getAllEmployees = async (req: Request, res: Response) => {
    const temp = await accountEmplServiceMongo.getAllEmployees();
    res.json(temp);
};
export const setRole = async (req: Request, res: Response) => {
    const id = req.body.id;
    const newRole = req.body.newRole as Roles;
    const employeeWithNewRole = await accountEmplServiceMongo.setRole(id,newRole);
    res.json(employeeWithNewRole);

};