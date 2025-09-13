import {accountEmplServiceMongo} from "../../../src/services/AccountServiceImplMongo.ts";
import {EmployeeModel} from "../../../src/model/EmployeeMongooseSchema.ts";

jest.mock("../../../src/model/EmployeeMongooseSchema.ts")
describe('AccountServiceMongoImpl.getEmployeeById', () => {
    const service = accountEmplServiceMongo;

    test('Failed test: employee not found', async () => {
        (EmployeeModel.findById as jest.Mock).mockReturnValue({
            exec:jest.fn().mockResolvedValue(null)
        })
        await expect(service.getEmployeeById("UNKNOWN")).rejects.toThrow(`Employee with id UNKNOWN not found`);

    })
    test('Passed test: ', async () => {
        const mockEmployee = {
            _id: "123",
            firstName: "MockEmp",
            hash: "23489",
            lastName: "MOCK",
            roles: "crew",
            table_num: "tab_num"
        };
        (EmployeeModel.findById as jest.Mock).mockReturnValue({
            exec: jest.fn().mockResolvedValue(mockEmployee)
        });
        await expect(service.getEmployeeById('123')).resolves.toEqual(mockEmployee);
        expect(EmployeeModel.findById).toHaveBeenCalledWith('123')
    });

})