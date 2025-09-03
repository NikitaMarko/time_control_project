import {AccountingService} from "./AccountService.js";
import {Employee, EmployeeDto, SavedFiredEmployee} from "../model/Employee.js";
import {EmployeeModel} from "../model/EmployeeMongooseSchema.js";
import {HttpError} from "../errorHandler/HttpError.js";
import bcrypt from "bcrypt";


export class AccountServiceImplMongo implements AccountingService{
    async changePassword(empId: string, newPassword: string): Promise<void> {
        const result = await EmployeeModel.findById(empId).exec();
        if(!result) throw new HttpError(400, "Employee not found");
        result.passHash = bcrypt.hashSync(newPassword, 10);
        await result.save();
    }

    async fireEmployee(empId: string): Promise<SavedFiredEmployee> {
        const fireEmp = await EmployeeModel.findByIdAndDelete(empId).exec();
        if(!fireEmp) throw new HttpError(400, "Employee not found");
        return fireEmp as unknown as SavedFiredEmployee;
    }

    async getAllEmployees(): Promise<SavedFiredEmployee[]> {
        const allEmp = await EmployeeModel.find().exec() as unknown as SavedFiredEmployee[];
        return Promise.resolve(allEmp);

    }

    async getEmployeeById(id: string): Promise<Employee> {
        const result = await EmployeeModel.findOne({id: id}).exec();
        if(!result) throw new HttpError(404, `Employee with ${id} not found`);
        return result as unknown as Employee;
    }

    async hireEmployee(employee: Employee): Promise<Employee> {
        const temp = await EmployeeModel.findById(employee.id) as unknown as Employee;
        if (temp) throw new HttpError(409, "Employee already exists");
        const employeeDoc = new EmployeeModel(temp) ;
        const saved = await employeeDoc.save();
        return saved as unknown as Employee;
    }

    async setRole(id: string, newRole: string): Promise<Employee> {
        const result = await EmployeeModel.findByIdAndUpdate(id, {role: newRole}, {new: true});
        if(!result) throw new HttpError(404, `Employee with ${id} not found`);
        return result as unknown as Employee;
    }

    async updateEmployee(empId: string, employee: EmployeeDto): Promise<Employee> {
        const updEmployee = await EmployeeModel.findByIdAndUpdate(empId, {
            firstName: employee.firstName,
            lastName: employee.lastName
        }, {new: true})
        if (!updEmployee) throw new HttpError(404, `Employee with id ${empId} not found`);
        const updated = updEmployee.toObject();
        const{passHash,...safeEmpl} = updated;

        return updated as unknown as Employee;
    }


}

export const accountEmplServiceMongo = new AccountServiceImplMongo();