import {AccountingService} from "./AccountService.js";
import {Employee, EmployeeDto, Roles, SavedFiredEmployee} from "../model/Employee.js";
import {EmployeeModel, FiredEmployeeModel} from "../model/EmployeeMongooseSchema.js";
import {HttpError} from "../errorHandler/HttpError.js";
import {checkRole, convertEmployeeToFiredEmployee} from "../utils/tools.js";
import bcrypt from "bcrypt";



export class AccountServiceImplMongo implements AccountingService {

    async changePassword(empId: string, newPassword: string): Promise<void> {
        const result = await EmployeeModel.findById(empId).exec();
        if (!result) throw new HttpError(404, `Employee with ${empId} not found`);
        result.hash = await bcrypt.hash(newPassword, 10);
        await result.save();
    }

    async fireEmployee(empId: string): Promise<SavedFiredEmployee> {
        const fireEmp = await EmployeeModel.findByIdAndDelete(empId);
        if (!fireEmp) throw new HttpError(404, `Employee with ${empId} not found`);
        const fired: SavedFiredEmployee = convertEmployeeToFiredEmployee(fireEmp as Employee);
        const firedDoc = new FiredEmployeeModel(fired);
        await firedDoc.save()
        return fired;
    }

    async getAllEmployees(): Promise<SavedFiredEmployee[]> {
        return await FiredEmployeeModel.find({}).exec() as SavedFiredEmployee[];
    }

    async getEmployeeById(id: string): Promise<Employee> {
        const employee = await EmployeeModel.findById(id).exec();
        if (!employee)
            throw new HttpError(404, `Employee with id ${id} not found`);
        return employee;
    }

    async hireEmployee(employee: Employee): Promise<Employee> {
        const temp = await EmployeeModel.findById(employee._id).exec();
        if (temp) throw new HttpError(409, `Employee with id ${employee._id} already exists`);
        const empDoc = new EmployeeModel(employee);
        await empDoc.save();
        return employee;
    }

    async setRole(id: string, newRole: string): Promise<Employee> {
        if (!Object.values(Roles).includes(newRole as Roles)) {
            throw new HttpError(400, "Invalid role");
        }
        const updated = await EmployeeModel.findOneAndUpdate({_id:id}, {roles:newRole},{new:true}).exec();
        if (!updated) throw new HttpError(404, "Account not found");
        return updated as unknown as Employee;
    }

    async updateEmployee(empId: string, employee: EmployeeDto): Promise<Employee> {
        const emp = await EmployeeModel.findByIdAndUpdate({_id:empId},employee,{new:true}).exec();
        if(!emp) throw new HttpError(404, `Employee with id ${empId} not found`);
        return emp
    }
}

export const accountEmplServiceMongo = new AccountServiceImplMongo();