import {accountEmplServiceMongo} from "../../../src/services/AccountServiceImplMongo.js";
import {HttpError} from "../../../src/errorHandler/HttpError.js";
import {EmployeeModel} from "../../../src/model/EmployeeMongooseSchema.js";
import {Roles} from "../../../src/model/Employee.js";

jest.mock("../../../src/model/EmployeeMongooseSchema.js")

describe("AccountServiceMongoImpl.setRole", ()=>{
    const service = accountEmplServiceMongo;
    const id = '1234';
    const successRole = Roles.MNG;
    test("Test failed: should throw error if role is invalid", async ()=>
    {
        const Negative_Role = 'Not a role';
        await expect(service.setRole(id,Negative_Role)).rejects.toThrow(HttpError);
        await expect(service.setRole(id,Negative_Role)).rejects.toThrow("Invalid role")
    })
    test('Test failed: account not found', async ()=>{
        (EmployeeModel.findOneAndUpdate as jest.Mock).mockReturnValue({
            exec:jest.fn().mockResolvedValue(null)
        })
        await expect(service.setRole(id,successRole)).rejects.toThrow("Account not found");
        expect(EmployeeModel.findOneAndUpdate).toHaveBeenCalledWith({_id:id}, {roles:successRole},{new:true})
    });
    test("Passed test:", async ()=>{
        (EmployeeModel.findOneAndUpdate as jest.Mock).mockReturnValue({
            exec:jest.fn().mockResolvedValue(successRole)
        });
        await expect(service.setRole(id,successRole)).resolves.toEqual(successRole);
        expect(EmployeeModel.findOneAndUpdate).toHaveBeenCalledWith({_id:id}, {roles:successRole},{new:true})
    })

})