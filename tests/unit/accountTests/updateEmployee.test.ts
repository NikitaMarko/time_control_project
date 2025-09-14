import {accountEmplServiceMongo} from "../../../src/services/AccountServiceImplMongo.js";
import {EmployeeModel} from "../../../src/model/EmployeeMongooseSchema.js";
import {EmployeeDto} from "../../../src/model/Employee.js";

jest.mock("../../../src/model/EmployeeMongooseSchema.js");
describe("AccountServiceMongoImpl.updateEmployee", ()=>{
    const service = accountEmplServiceMongo;
    const dto:EmployeeDto = {
           firstName: "Family",
            lastName: "Name",
            password: "password",
            id: "123"
    }
    const empId = "1234";

    test('Test failed: employee not found', async ()=>{
        (EmployeeModel.findByIdAndUpdate as jest.Mock).mockReturnValue({
            exec:jest.fn().mockResolvedValue(null)
        })
        await expect(service.updateEmployee(empId,dto)).rejects.toThrow(`Employee with id ${empId} not found`)
        expect(EmployeeModel.findByIdAndUpdate).toHaveBeenCalledWith({_id:empId}, dto, {new:true})
    });
    test('Passed test:', async ()=>{
        (EmployeeModel.findByIdAndUpdate as jest.Mock).mockReturnValue({
            exec:jest.fn().mockResolvedValue(dto)
        });
        await expect(service.updateEmployee(empId,dto)).resolves.toEqual(dto);
        expect(EmployeeModel.findByIdAndUpdate).toHaveBeenCalledWith({_id:empId}, dto, {new:true})
    })
})