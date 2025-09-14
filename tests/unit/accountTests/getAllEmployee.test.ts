import {accountEmplServiceMongo} from "../../../src/services/AccountServiceImplMongo.js";
import {FiredEmployeeModel} from "../../../src/model/EmployeeMongooseSchema.js";

jest.mock("../../../src/model/EmployeeMongooseSchema.js")

describe("AccountServiceMongoImpl.getAllEmployees", () => {
    const service = accountEmplServiceMongo;
    const mockFiredEmployee = {
        firstName: "MockEmp",
        lastName: "MOCK",
        _id: "123",
        table_num: "tab_num",
        fireDate: 'now'
    }
    test("getAllEmployees", async () => {
        (FiredEmployeeModel.find as jest.Mock).mockReturnValue({
            exec:jest.fn().mockResolvedValue([mockFiredEmployee])
        })
        await expect(service.getAllEmployees()).resolves.toEqual([mockFiredEmployee]);
        expect(FiredEmployeeModel.find).toHaveBeenCalledWith({});
    })
})