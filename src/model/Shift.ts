
export type CrewShift = {
    shift_id:number,
    startShift:number,
    finishShift:number,
    table_num:string,
    shiftDuration:number,
    breaks:number,
    correct:string|null,
    monthHours:number
}

export type CurrentCrewShift = {
    shift_id:number,
    startShift:number,
    table_num:string,
    breaks:number
}

export type ShiftCorrection = {
    crew_table_num: string;
    manager_table_num: string;
    startShift: number;
    finishShift: number;
    date?: string;
};