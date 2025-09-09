import {accountEmplServiceMongo} from "../../../src/services/AccountServiceImplMongo.ts";
import {HttpError} from "../../../src/errorHandler/HttpError.ts";
import {EmployeeModel} from "../../../src/model/EmployeeMongooseSchema.ts";
jest.mock("../../../src/model/EmployeeMongooseSchema.ts")
describe('AccountServiceMongoImpl.getEmployeeById', () => {
    test('Failed test: employee not found', async () => {
        const service = accountEmplServiceMongo;
        (EmployeeModel.findById as jest.Mock).mockResolvedValue(null)
        await expect(service.getEmployeeById("UNKNOWN")).rejects.toThrow(`Employee with id UNKNOWN not found`);

    })
})