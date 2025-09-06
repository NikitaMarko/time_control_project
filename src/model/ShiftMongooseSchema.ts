import * as mongoose from "mongoose";
import {CrewShift, CurrentCrewShift} from "./Shift.js";


export const CrewShiftMongoSchema = new mongoose.Schema({
    shift_id:{type:Number,required: true},
    startShift:{type:Number,required: true},
    finishShift:{type:Number,required: false, default: null},
    table_num:{type:String, required: true},
    shiftDuration:{type:Number,required: true},
    breaks:{type:Number,required: true},
    correct:{type:String,required: false, default: null},
    monthHours:{type:Number,required: true}
})

export const CrewShiftMongoModel = mongoose.model<CrewShift>('CrewShift', CrewShiftMongoSchema, 'crews_shift')

export const CurrCrewShiftMongoSchema = new mongoose.Schema({
    shift_id:{type:Number,required: true},
    startShift:{type:Number,required: true},
    table_num:{type:String, required: true},
    breaks:{type:Number,required: true}
})

export const CurrCrewShiftMongoModel = mongoose.model<CurrentCrewShift>("CurrCrewShift", CurrCrewShiftMongoSchema, 'curr_crews_shift')

export const ShiftCorrectionMongoSchema = new mongoose.Schema({
    crew_table_num: {type:String, required: true},
    manager_table_num: {type:String, required: true},
    startShift: {type:Number,required: true},
    finishShift: {type:Number,required: true},
    date: {type:String, required: true}
})

export const ShiftCorrectionMongooseModel = mongoose.model('ShiftCorrection', ShiftCorrectionMongoSchema, 'shift_correction')