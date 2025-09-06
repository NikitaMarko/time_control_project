export type EmployeeDto = {
    firstName: string,
    lastName: string,
    password: string,
    id: string,
}

export type Employee = {
    firstName: string,
    lastName: string,
    _id: string,
    table_num: string,
    hash: string,
    roles: Roles
}

export type SavedFiredEmployee = {
    firstName: string,
    lastName: string,
    _id: string,
    table_num: string,
    fireDate?: string,
}

export type EmployeeUpdates = {
    firstName: string,
    lastName: string
}

export enum Roles {
    CREW = "crew",
    MNG = "manager",
    HR = "hr",
    SUP = "supervisor"
}


