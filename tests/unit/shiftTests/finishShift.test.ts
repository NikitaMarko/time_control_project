import {ShiftControlServiceMongo} from "../../../src/services/ShiftControlServiceImplMongo.js";
import {ShiftMongoModel} from "../../../src/model/ShiftMongooseSchema.js";

jest.mock("../../../src/model/ShiftMongooseSchema.js")

describe("ShiftControlServiceMongoImpl.finishShift", ()=>{
    const service = ShiftControlServiceMongo;
    const crew_table_num = 'crew_table_num';
    const fixedTime = 234567890000;
    const mockStartShift = (fixedTime - 3600000);
    const breaks = 15;
    const finish = fixedTime;
    const quantityShift = 2;
    const duration = ((finish - mockStartShift) - (breaks*60000))/60000;
    const monthHours = (duration*quantityShift)/60;

    const TabNumTimeTypeDto = {
        crew_table_num,
        time:fixedTime.toString()
    }
    beforeEach(() => {
        jest.spyOn(Date, 'now').mockReturnValue(fixedTime);
    });
    afterEach(() => {
        jest.restoreAllMocks();
    });
    test('Test failed: no find activeShift with no crew_table_num', async ()=>{
        (ShiftMongoModel.findOne as jest.Mock).mockResolvedValue(null)
        await expect(service.finishShift(crew_table_num)).rejects.toThrow(`No find active shift for ${crew_table_num}`)
        expect(ShiftMongoModel.findOne).toHaveBeenCalledWith({crew_table_num})
    });
    test('Test passed:', async ()=>{
        (ShiftMongoModel.findOne as jest.Mock).mockResolvedValue({
            _id: "123",
            startShift: mockStartShift,
            breaks: breaks,
            crew_table_num,
            correct: null,
            manager_table_num: null,
            date: new Date(fixedTime).toISOString(),
        });
        service.getCurrentActivityShift = jest.fn().mockResolvedValue({ quantityShift });
        (ShiftMongoModel.updateOne as jest.Mock).mockResolvedValue({ modifiedCount: 1 })
        await expect(service.finishShift(crew_table_num)).resolves.toEqual(TabNumTimeTypeDto)
        expect(ShiftMongoModel.updateOne).toHaveBeenCalledWith(
            { _id: '123' },
            {
                $set: {
                    startShift: mockStartShift,
                    finishShift: finish,
                    crew_table_num: crew_table_num,
                    shiftDuration: duration,
                    breaks: breaks,
                    monthHours: monthHours,
                    correct: null,
                    manager_table_num: null,
                    date: new Date(fixedTime).toISOString()
                }
            })
    })

})