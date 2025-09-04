import {AccountingService} from "./AccountService.js";
import {Employee, EmployeeDto, Roles, SavedFiredEmployee} from "../model/Employee.js";
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
        const fireEmp = await EmployeeModel.findById(empId);
        if (!fireEmp) throw new HttpError(404, "Employee not found");

        const last = fireEmp.wasActiveWorking[fireEmp.wasActiveWorking.length - 1];
        if (!last || last.end) throw new HttpError(400, "Employee already fired or no active period found");

        last.end = new Date();
        await fireEmp.save();

        const saved = fireEmp.toObject();
        return {
            id: saved._id,
            firstName: saved.firstName,
            lastName: saved.lastName,
            roles: (saved.roles as string[]).filter((r): r is Roles =>
                Object.values(Roles).includes(r as Roles)
            ),
            wasActiveWorking: saved.wasActiveWorking.map(({ start, end }) => ({
                start,
                end: end ?? undefined
            }))
        };
    }

    async getAllEmployees(): Promise<SavedFiredEmployee[]> {
        const firedEmpDocs = await EmployeeModel.find({
            wasActiveWorking: {
                $elemMatch: {
                    end: { $lt: new Date() }
                }
            }
        }).lean().exec();

        return firedEmpDocs
            .map(emp => ({
            id: emp._id,
            firstName: emp.firstName,
            lastName: emp.lastName,
            roles: (emp.roles as string[]).filter((r): r is Roles =>
                Object.values(Roles).includes(r as Roles)
            ),
                wasActiveWorking: Array.isArray(emp.wasActiveWorking)
                    ? emp.wasActiveWorking.map(w => ({
                        start: new Date(w.start),
                        end: (w.end !== null && w.end !== undefined) ? new Date(w.end) : undefined
                    }))
                    : []
        }));
    }

    async getEmployeeById(id: string): Promise<Employee> {
        const result = await EmployeeModel.findOne({_id: id}).lean().exec();
        if(!result) throw new HttpError(404, `Employee with ${id} not found`);
        return result as unknown as Employee;
    }

    async hireEmployee(employee: Employee): Promise<Employee> {
        if (employee.id) {
            const existing = await EmployeeModel.findById(employee.id);
            if (existing) throw new HttpError(409, "Employee already exists");
        }

        const employeeDoc = new EmployeeModel({
            _id: employee.id,
            firstName: employee.firstName,
            lastName: employee.lastName,
            passHash: employee.passHash,
            roles: employee.roles,
            wasActiveWorking: [
                {
                    start: new Date()
                }
            ]
        });

        await employeeDoc.save();
        const saved = employeeDoc.toObject();

        return  {
            id: saved._id,
            firstName: saved.firstName,
            lastName: saved.lastName,
            passHash: saved.passHash,
            roles: (saved.roles as string[]).filter(
                (role): role is Roles => Object.values(Roles).includes(role as Roles)
            ),
            wasActiveWorking: saved.wasActiveWorking.map(w => ({
                start: new Date(w.start),
                end: w.end ? new Date(w.end) : undefined
            }))
        };
    }

    async setRole(id: string, newRole: string): Promise<Employee> {
        if (!Object.values(Roles).includes(newRole as Roles)) {
            throw new HttpError(400, `Invalid role: ${newRole}`);
        }
        const result = await EmployeeModel.findByIdAndUpdate(id, {roles: [newRole]}, {new: true});
        if(!result) throw new HttpError(404, `Employee with ${id} not found`);
        const saved = result.toObject();
        const { passHash, ...newObj } = saved;

        return {
            id: newObj._id,
            firstName: newObj.firstName,
            lastName: newObj.lastName,
            roles: (newObj.roles as string[]).filter(
                (r): r is Roles => Object.values(Roles).includes(r as Roles)
            ),
            wasActiveWorking: newObj.wasActiveWorking.map((item: any) => ({
                start: new Date(item.start),
                end: item.end ? new Date(item.end) : undefined
            }))
        };
    }

    async updateEmployee(empId: string, employee: EmployeeDto): Promise<Employee> {
        const updEmployee = await EmployeeModel.findByIdAndUpdate(empId, {
            firstName: employee.firstName,
            lastName: employee.lastName
        }, {new: true})
        if (!updEmployee) throw new HttpError(404, `Employee with id ${empId} not found`);
        const updated = updEmployee.toObject();
        const {passHash, ...safeEmpl} = updated;
        return {
            id: safeEmpl._id,
            firstName: safeEmpl.firstName,
            lastName: safeEmpl.lastName,
            roles: (safeEmpl.roles as string[]).filter((r): r is Roles =>
                Object.values(Roles).includes(r as Roles)
            ),
            wasActiveWorking: safeEmpl.wasActiveWorking.map(({start, end}) => ({
                start: new Date(start),
                end: end ? new Date(end) : undefined
            }))
        };

    }
}

export const accountEmplServiceMongo = new AccountServiceImplMongo();