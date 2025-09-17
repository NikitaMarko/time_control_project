import {accountEmplServiceMongo} from "../../../src/services/AccountServiceImplMongo.ts";
import {EmployeeModel, FiredEmployeeModel} from "../../../src/model/EmployeeMongooseSchema.ts";
import {convertEmployeeToFiredEmployee} from "../../../src/utils/tools.ts";
import {describe} from "node:test";

jest.mock("../../../src/model/EmployeeMongooseSchema.ts")
jest.mock("../../../src/utils/tools.ts")


describe("AccountServiceMongoImpl.fireEmployee",()=>{
    const service = accountEmplServiceMongo;
    const mockEmployee = {
        _id: "123",
        firstName: "MockEmp",
        hash: "23489",
        lastName: "MOCK",
        roles: "crew",
        table_num: "tab_num"
    };
    const mockFiredEmployee = {
        firstName: "MockEmp",
        lastName: "MOCK",
        _id: "123",
        table_num: "tab_num",
        fireDate: 'now'
    }
    test("Test failed: employee not exist", ()=>{
        (EmployeeModel.findByIdAndDelete as jest.Mock).mockResolvedValue(null);
        expect(service.fireEmployee("1234")).rejects.toThrow(`Employee with id 1234 not found`)
        expect(EmployeeModel.findByIdAndDelete).not.toHaveBeenCalledWith('123')
    });
    test("Test passed", async () => {
        (EmployeeModel.findByIdAndDelete as jest.Mock).mockResolvedValue(mockEmployee);
        (convertEmployeeToFiredEmployee as jest.Mock).mockReturnValue(mockFiredEmployee);
        (FiredEmployeeModel as unknown as jest.Mock)
            .mockImplementation(() => ({
                save: jest.fn().mockResolvedValue(mockFiredEmployee)
            }));
        await expect(service.fireEmployee('123')).resolves.toEqual(mockFiredEmployee);
        expect(EmployeeModel.findByIdAndDelete).toHaveBeenCalledWith('123');
        expect(convertEmployeeToFiredEmployee).toHaveBeenCalledWith(mockEmployee);
        expect(FiredEmployeeModel).toHaveBeenCalledWith(mockFiredEmployee);

    })
})