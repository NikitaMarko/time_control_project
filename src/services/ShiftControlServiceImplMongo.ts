import {ShiftControlService} from "./ShiftControlService.js";
import {CrewShift, ShiftCorrection, TabNumTimeTypeDto} from "../model/Shift.js";
import {
    ShiftMongoModel
} from "../model/ShiftMongooseSchema.js";
import {HttpError} from "../errorHandler/HttpError.js";
import {generateShiftId} from "../utils/tools.js";

export class ShiftControlServiceImplMongo implements ShiftControlService {

    async breaks(crew_table_num: string, breakDuration: number): Promise<void> {
        const currentShift = await ShiftMongoModel.findOne({crew_table_num});
        if (!currentShift)
            throw new HttpError(404, `No find active shift for ${crew_table_num}`)
        const break15 = 15;
        const break30 = 30;
        if (![break15, break30].includes(breakDuration)) {
            throw new HttpError(400, `You can take a break of only 15 or 30 minutes`)
        }
        currentShift.breaks += breakDuration;
        await currentShift.save()

    }

    async correctShift(correct: ShiftCorrection): Promise<void> {
        const currentShift = await ShiftMongoModel.findOne({crew_table_num:correct.crew_table_num})
        if (!currentShift)
            throw new HttpError(404, `No find active shift for ${correct.crew_table_num}`)
        const now = Date.now();
        const finish = correct.finishShift ?? now;

        const { quantityShift } = await this.getCurrentActivityShift(correct.crew_table_num);

        const start = correct.startShift;
        const duration = (finish - start) / 60000;
        const monthHours = (duration * quantityShift) / 60;

        await ShiftMongoModel.updateOne(
            {_id: currentShift._id},
            {
                $set: {
                    startShift: start,
                    finishShift: finish,
                    manager_table_num: correct.manager_table_num,
                    correct: correct.manager_table_num,
                    date: correct.date ?? new Date().toISOString().split('T')[0],
                    shiftDuration: duration,
                    monthHours: monthHours,
                    breaks: currentShift.breaks ?? 0

                }
            }
        );
    }

    async finishShift(crew_table_num: string): Promise<TabNumTimeTypeDto> {
        const currentShift = await ShiftMongoModel.findOne({crew_table_num});
        if (!currentShift) {
            throw new HttpError(404, `No find active shift for ${crew_table_num}`);
        }
        const {quantityShift} = await this.getCurrentActivityShift(crew_table_num);
        const finish = Date.now();

        const duration = ((finish - currentShift.startShift) - (currentShift.breaks*60000))/60000;
        const monthHours = (duration*quantityShift)/60;

        await ShiftMongoModel.updateOne(
            { _id: currentShift._id },
            {
                $set: {
                    startShift: currentShift.startShift,
                    finishShift: finish,
                    crew_table_num: currentShift.crew_table_num,
                    shiftDuration: duration,
                    breaks: currentShift.breaks,
                    monthHours: monthHours,
                    correct: currentShift.correct ?? null,
                    manager_table_num: currentShift.manager_table_num ?? null,
                    date: currentShift.date ?? new Date().toISOString(),
                }
            }
        );

        return {crew_table_num, time: finish.toString()};
    }

    async getCurrentShiftStaff(): Promise<CrewShift[]> {
        return ShiftMongoModel.find();
    }

    async startShift(crew_table_num: string): Promise<TabNumTimeTypeDto> {
        const isExistShift = await ShiftMongoModel.findOne({crew_table_num})
        if (isExistShift) throw new HttpError(409, `Already have shift for crew with ${crew_table_num}`);
        const now = Date.now();

        const startShift =  new ShiftMongoModel({
            _id: Number(generateShiftId()),
            startShift: now,
            finishShift:null,
            crew_table_num,
            shiftDuration:null,
            breaks:0
        })
        await startShift.save();

        return { crew_table_num, time: now.toString() };
    }
    async getCurrentActivityShift(crew_table_num?:string): Promise<{ quantityShift: number }> {
        const filter = {crew_table_num};
        const temp = await ShiftMongoModel.find(filter);
        if (temp.length === 0) {
            return { quantityShift: 0 };
        }
        return { quantityShift: temp.length };
    }
}

export const ShiftControlServiceMongo = new ShiftControlServiceImplMongo();