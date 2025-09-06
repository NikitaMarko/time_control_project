import {ShiftControlService} from "./ShiftControlService.js";
import {CurrentCrewShift, ShiftCorrection} from "../model/Shift.js";
import {
    CrewShiftMongoModel,
    CurrCrewShiftMongoModel,
    ShiftCorrectionMongooseModel
} from "../model/ShiftMongooseSchema.js";
import {HttpError} from "../errorHandler/HttpError.js";

export class ShiftControlServiceImplMongo implements ShiftControlService {

    async breaks(table_num: string, breakDuration: number): Promise<void> {
        const currentShift = await CurrCrewShiftMongoModel.findOne({table_num});
        if (!currentShift)
            throw new HttpError(404, `No find active shift for ${table_num}`)
        const break15 = 15;
        const break30 = 30;
        if(![break15, break30].includes(breakDuration)){
            throw new HttpError(400, `You can take a break of only 15 or 30 minutes`)
        }
        currentShift.breaks += breakDuration;
        await currentShift.save()

    }

    async correctShift(correct: ShiftCorrection): Promise<void> {
        const currentShift = await CurrCrewShiftMongoModel.findOne({table_num:correct.crew_table_num})
        if (!currentShift)
            throw new HttpError(404, `No find active shift for ${correct.crew_table_num}`)
        const now = new Date();
        const finishShift = correct.finishShift ?? now;

        const correctionShift = new ShiftCorrectionMongooseModel({
            crew_table_num: correct.crew_table_num,
            manager_table_num: correct.manager_table_num,
            startShift:correct.startShift,
            finishShift:finishShift,
            date:now.toISOString()
        })
        await correctionShift.save()
    }

    async finishShift(table_num: string): Promise<{ table_num: string; time: number }> {
        const currentShift = await CrewShiftMongoModel.findOne({table_num});
        if (!currentShift) {
            throw new HttpError(404, `No find active shift for ${table_num}`);
        }
        const {quantityShift} = await this.getCurrentActivityShift(table_num);
        const finish = Date.now();

        const duration = finish - currentShift.startShift - currentShift.breaks*60000;
        const monthHours = duration*quantityShift;

        const result = new CrewShiftMongoModel({
            shift_id:currentShift.shift_id,
            startShift:currentShift.startShift,
            finishShift:finish,
            table_num:currentShift.table_num,
            shiftDuration: duration,
            breaks:currentShift.breaks,
            correct:null,
            monthHours:monthHours
        })
        await result.save();
        await CurrCrewShiftMongoModel.deleteOne({table_num});
        return {table_num, time: finish};
    }

    async getCurrentShiftStaff(): Promise<CurrentCrewShift[]> {
        return CurrCrewShiftMongoModel.find();
    }

    async startShift(table_num: string): Promise<{ table_num: string; time: number }> {
        const now = Date.now();
        const startShift =  new CurrCrewShiftMongoModel({
            shift_id: now,
            startShift: now,
            table_num,
            breaks:0
        })
        await startShift.save();

        return { table_num, time: now };
    }
    async getCurrentActivityShift(table_num?:string): Promise<{ quantityShift: number }> {
        const filter = table_num?{table_num}:{};
        const temp = await CurrCrewShiftMongoModel.find(filter);
        return {quantityShift:temp.length}
    }

}

export const ShiftControlServiceMongo = new ShiftControlServiceImplMongo();