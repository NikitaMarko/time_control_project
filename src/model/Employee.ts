export type EmployeeDto = {
    firstName: string,
    lastName: string,
    password: string,
    id: string,
}

export type Employee = {
    firstName: string,
    lastName: string,
    passHash?: string,
    id: string,
    roles: Roles[],
    wasActiveWorking: wasActiveWorking[]
}

export type SavedFiredEmployee = {
    id: string;
    firstName: string;
    lastName: string;
    roles: Roles[];
    wasActiveWorking: wasActiveWorking[]
};

export type wasActiveWorking = {
    start: Date;
    end?: Date;
}

export enum Roles {
    CREW = "crew",
    MNG = "manager",
    HR = "hr",
    SUP = "supervisor"
}


