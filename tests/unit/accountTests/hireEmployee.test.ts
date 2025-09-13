import {accountEmplServiceMongo} from "../../../src/services/AccountServiceImplMongo.ts";
import {EmployeeModel} from "../../../src/model/EmployeeMongooseSchema.ts";
import {Employee} from "../../../src/model/Employee.ts";
import {checkFiredEmployees} from "../../../src/utils/tools.ts";

jest.mock("../../../src/model/EmployeeMongooseSchema.ts");
jest.mock("../../../src/utils/tools.ts");

describe('AccountServiceMongoImpl.hireEmployee', ()=> {
    const service = accountEmplServiceMongo;
    const mockEmployee = {
        _id: "123",
        firstName: "MockEmp",
        hash: "23489",
        lastName: "MOCK",
        roles: "crew",
        table_num: "tab_num"
    };
    //=============================1 Employee already exists=========
    test("Failed test: Employee already exists", () => {
        (EmployeeModel.findById as jest.Mock).mockReturnValue({
            exec: jest.fn().mockResolvedValue(mockEmployee)
        });
        expect(service.hireEmployee(mockEmployee as Employee))
            .rejects.toThrow(`Employee with id ${mockEmployee._id} already exists`);
        expect(EmployeeModel.findById).toHaveBeenCalledWith(mockEmployee._id);
    });
    test("Failed test: Employee was fired early", async () => {
        (EmployeeModel.findById as jest.Mock).mockReturnValue({
            exec: jest.fn().mockResolvedValue(null)
        });
        (checkFiredEmployees as jest.Mock).mockRejectedValue(new Error('mock Error'));
        await expect(service.hireEmployee(mockEmployee as Employee)).rejects.toThrow('mock Error')
        expect(EmployeeModel.findById).toHaveBeenCalledWith(mockEmployee._id);
        expect(checkFiredEmployees).toHaveBeenCalledWith(mockEmployee._id);
    });
    test("Passed test: ", async () => {
        (EmployeeModel.findById as jest.Mock).mockReturnValue({
            exec: jest.fn().mockResolvedValue(null)
        });
        (checkFiredEmployees as jest.Mock).mockResolvedValue(undefined);
        (EmployeeModel as unknown as jest.Mock).mockImplementation(() => ({
            save: jest.fn().mockResolvedValue(mockEmployee),
        }));
        const result = await service.hireEmployee(mockEmployee as Employee);
        expect(EmployeeModel.findById).toHaveBeenCalledWith(mockEmployee._id);
        expect(checkFiredEmployees).toHaveBeenCalledWith(mockEmployee._id);
        expect(result).toEqual(mockEmployee);
    })
})