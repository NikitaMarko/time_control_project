import * as mongoose from "mongoose";


export const CrewShiftMongoSchema = new mongoose.Schema({
    _id:{type:Number,required: true},
    startShift:{type:Number,required: true},
    finishShift:{type:Number,required: false, default: null},
    crew_table_num:{type:String, required: true},
    shiftDuration:{type:Number,required: false, default:0},
    breaks:{type:Number,default:null},
    correct:{type:String,required: false, default: null},
    monthHours:{type:Number,default:0},
    manager_table_num: {type:String, required: false, default: null},
    date: {type:String, required: false, default: null}
})

export const ShiftMongoModel = mongoose.model('Shift', CrewShiftMongoSchema, 'crews_shift')