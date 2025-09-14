import {ShiftControlServiceMongo} from "../../../src/services/ShiftControlServiceImplMongo.js";
import {ShiftMongoModel} from "../../../src/model/ShiftMongooseSchema.js";

jest.mock("../../../src/model/ShiftMongooseSchema.js");

describe("ShiftControlServiceMongoImpl.getCurrentShiftStaff",()=>{
    const service = ShiftControlServiceMongo;
    const CrewShift = {
        _id:123,
        startShift:100,
        finishShift:220,
        crew_table_num:'crew_table_num',
        shiftDuration:111,
        breaks:0,
        correct:'mng_table_num',
        monthHours:2
    }
    test('Passed test:', async ()=>{
        (ShiftMongoModel.find as jest.Mock).mockResolvedValue([CrewShift]);
        await expect(service.getCurrentShiftStaff()).resolves.toEqual([CrewShift]);
        expect(ShiftMongoModel.find).toHaveBeenCalledWith();
    })

})