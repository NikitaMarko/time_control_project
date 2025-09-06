import {CurrentCrewShift, ShiftCorrection} from "../model/Shift.js";

export interface ShiftControlService {
    startShift:(table_num:string)=> Promise<{ table_num: string; time: number }>;
    finishShift:(table_num:string)=> Promise<{ table_num: string; time: number }>;
    breaks:(table_num:string,breakDuration:number)=> Promise<void>;
    correctShift:(correct:ShiftCorrection)=> Promise<void>;
    getCurrentShiftStaff:()=>Promise<CurrentCrewShift[]>
    getCurrentActivityShift:(table_num?:string)=>Promise<{ quantityShift: number }>

}