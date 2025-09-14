import {ShiftControlServiceMongo} from "../../../src/services/ShiftControlServiceImplMongo.js";
import {ShiftMongoModel} from "../../../src/model/ShiftMongooseSchema.js";

jest.mock("../../../src/model/ShiftMongooseSchema.js")


describe("ShiftControlServiceMongoModel.startShift", () => {
    const service = ShiftControlServiceMongo;
    const crew_table_num = 'crew_table_num';
    const fixedTime = '1234567890';

    const TabNumTimeTypeDto = {
        crew_table_num,
        time:fixedTime
    }
    beforeEach(() => {
        jest.spyOn(Date, 'now').mockReturnValue(Number(fixedTime));
    });
    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('Test failed: already have shift for crew table', async () => {
        (ShiftMongoModel.findOne as jest.Mock).mockResolvedValue({crew_table_num})
        await expect(service.startShift(crew_table_num)).rejects.toThrow(`Already have shift for crew with ${crew_table_num}`)
        expect(ShiftMongoModel.findOne).toHaveBeenCalledWith({ crew_table_num });
    });
    test('Test passed:', async () => {
        (ShiftMongoModel.findOne as jest.Mock).mockResolvedValue(null);

        (ShiftMongoModel as unknown as jest.Mock).mockImplementation(() => ({
            save: jest.fn().mockResolvedValue(TabNumTimeTypeDto)
        }));

        await expect(service.startShift(crew_table_num)).resolves.toEqual(TabNumTimeTypeDto);

        expect(ShiftMongoModel.findOne).toHaveBeenCalledWith({ crew_table_num });
    });


})