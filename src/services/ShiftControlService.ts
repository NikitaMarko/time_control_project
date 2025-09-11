import {CrewShift, ShiftCorrection, TabNumTimeTypeDto} from "../model/Shift.js";

export interface ShiftControlService {
    startShift:(crew_table_num:string)=> Promise<TabNumTimeTypeDto>;
    finishShift:(crew_table_num:string)=> Promise<TabNumTimeTypeDto>;
    breaks:(crew_table_num:string,breakDuration:number)=> Promise<void>;
    correctShift:(correct:ShiftCorrection)=> Promise<void>;
    getCurrentShiftStaff:()=>Promise<CrewShift[]>
    getCurrentActivityShift:(crew_table_num?:string)=>Promise<{ quantityShift: number }>

}