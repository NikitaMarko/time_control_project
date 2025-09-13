import {accountEmplServiceMongo} from "../../../src/services/AccountServiceImplMongo.js";
import {EmployeeModel} from "../../../src/model/EmployeeMongooseSchema.js";
import bcrypt from "bcrypt";

jest.mock("../../../src/model/EmployeeMongooseSchema.ts")
jest.mock('bcrypt', () => ({
    __esModule: true,
    default: {
        hash: jest.fn()
    },
}));


describe("AccountServiceMongoImpl.changePassword", ()=>{
    const service = accountEmplServiceMongo;
    const mockEmployee = {
        _id: "123",
        firstName: "MockEmp",
        hash: "23489",
        lastName: "MOCK",
        roles: "crew",
        table_num: "tab_num",
        save:jest.fn().mockResolvedValue(undefined)
    };
    test("Test failed: employee not exist", async () => {
        (EmployeeModel.findById as jest.Mock).mockReturnValue({
            exec: jest.fn().mockResolvedValue(null)
        });
        await expect(service.changePassword('123', 'newPassword'))
            .rejects.toThrow(`Employee with 123 not found`);
        expect(EmployeeModel.findById).toHaveBeenCalledWith('123');
    });
    test("Passed test", async ()=>{
        (EmployeeModel.findById as jest.Mock).mockReturnValue({
            exec:jest.fn().mockResolvedValue(mockEmployee)
        });
        (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
        await expect(service.changePassword('123', 'newPassword')).resolves.toBeUndefined();
        expect(EmployeeModel.findById).toHaveBeenCalledWith('123');
        expect(bcrypt.hash).toHaveBeenCalledWith('newPassword', 10);
        expect(mockEmployee.save).toHaveBeenCalledWith();

    })
})