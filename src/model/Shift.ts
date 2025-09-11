
export type TabNumTimeTypeDto = {
    crew_table_num:string,
    time:string
}

export type CrewShift = {
    _id:number,
    startShift:number,
    finishShift:number|null,
    crew_table_num:string,
    shiftDuration:number,
    breaks:number,
    correct:string|null,
    monthHours:number,
    manager_table_num?: string,
    date?: string;
}

export type ShiftCorrection = {
    crew_table_num: string;
    manager_table_num: string;
    startShift: number;
    finishShift: number;
    date?: string;
};