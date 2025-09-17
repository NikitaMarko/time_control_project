# Time Control Project

## Introduction

**Time Control Project** is a server-side application for tracking employee working hours.
The project's goal is to provide a convenient REST API for recording the start and end of the workday,
managing employees, calculating hours worked, and generating reports.

**Project type:** educational mini-project.
**Stack:** Node.js + Express.js, MongoDB, TypeScript, Jest.
**Containerization:** none (Docker is not used).

## Start of project

1.Install dependencies:

npm install

2.Create a .env file in the root of the project with the following settings:

OWNER=100000000

OWNER_PASS=123456789.com

db=mongodb+srv://NikitaMarkovskii:QqrMHqGXXWRaGe5H@cluster-java-27-30.cttizwq.mongodb.net/employee?retryWrites=true&w=majority&appName=Cluster-Java-27-30

JWT_SECRET=super-secret-key-for-jwt-token

JWT_EXP=1h

LOG_LEVEL=info

3.Run the server in dev mode:

npm run dev

## Security

**JWT tokens** (future) for user authentication and authorization.
**Password hashing** — passwords are not stored in plaintext.
**Input validation** implemented using Joi.
**Centralized error handling** — a custom errorHandler is used for error handling.
**Logging** — Winston is used for logging requests and errors.

## Description of endpoints

### Employee Routes (/employee)

| Method | Endpoint                     | Description                 |
|--------|------------------------------|-----------------------------|
| POST   | /employee/                   | Hire Employee               |
| GET    | /employee/                   | Getting a list of employees |
| GET    | /employee/:id                | Getting an employee by ID   |
| PUT    | /employee/:empId             | Updating employee data      |
| PATCH  | /employee/password           | Change password by profile  |
| PUT    | /employee/roles/:id/:newRole | Changing an employee's role |
| DELETE | /employee/:empId             | Fire Employee               |
 -----------------------------------------------------------------------
#### Example request:

POST /employee/  
Content-Type: application/json  

{  
"firstName": "John",  
"lastName": "Snow",  
"password": "12345"  
}

#### Example response:

{  
"firstName": "John",

"lastName": "Snow",

"_id": "9ef344e3-075e-469e-a737-3a962c83e8a1",

"table_num": "TAB-1758135826083",

"roles": "crew",

"hash": fgd5FeR0-9E2aq123-rfCCb
}

### Shift Routes (/shift)

| Method | Endpoint                        | Description                                   |
|--------|---------------------------------|-----------------------------------------------|
| GET    | /shift/activity/:crew_table_num | Getting active shifts for a specific employee |
| GET    | /shift/staff                    | Obtaining a list of employees on shift        |
| PUT    | /shift/start_staff              | Start shift                                   |
| PUT    | /shift/finish_staff             | Finish shift                                  |
| PUT    | /shift/correct                  | Correcting shift times                        |
| PATCH  | /shift/breaks                   | Updates information of breaks                 |
---------------------------------------------------------------------------------------------
#### Example request:

PUT /shift/start_staff  
Content-Type: application/json  

{
"crew_table_num":"TAB-1000000000002"
}

#### Example response:

{
"crew_table_num": "TAB-1000000000004",
"time": "1758137992194"
}

## Test Examples

The project uses **Jest** for unit testing.

Example test for the employee hiring endpoint:

**jest**.mock("../../../src/model/EmployeeMongooseSchema.ts");  
**jest**.mock("../../../src/utils/tools.ts");  
  
describe('AccountServiceMongoImpl.hireEmployee', ()=> {  
**const** service = accountEmplServiceMongo;  
**const** mockEmployee = {  
_id: "123",  
firstName: "MockEmp",  
hash: "23489",  
lastName: "MOCK",  
roles: "crew",  
table_num: "tab_num"  
};  
## //=============================1 Employee already exists================  
**test**("Failed test: Employee already exists", () => {  
(EmployeeModel.findById as jest.Mock).mockReturnValue({  
exec: jest.fn().mockResolvedValue(mockEmployee)  
});  
expect(service.hireEmployee(mockEmployee as Employee))  
.rejects.toThrow(`Employee with id ${mockEmployee._id} already exists`);  
expect(EmployeeModel.findById).toHaveBeenCalledWith(mockEmployee._id);  
});

## //=============================2 Employee was fired early===================  
  
**test**("Failed test: Employee was fired early", **async** () => {  
(EmployeeModel.findById as jest.Mock).mockReturnValue({  
exec: jest.fn().mockResolvedValue(null)  
});  
(checkFiredEmployees as jest.Mock).mockRejectedValue(new Error('mock Error'));  
await expect(service.hireEmployee(mockEmployee as Employee)).rejects.toThrow('mock Error')  
expect(EmployeeModel.findById).toHaveBeenCalledWith(mockEmployee._id);  
expect(checkFiredEmployees).toHaveBeenCalledWith(mockEmployee._id);  
});

## //=============================3 Passed test: ===========================  

**test**("Passed test: ", async () => {  
(EmployeeModel.findById as jest.Mock).mockReturnValue({  
exec: jest.fn().mockResolvedValue(null)  
});  
(checkFiredEmployees as jest.Mock).mockResolvedValue(undefined);  
(EmployeeModel as unknown as jest.Mock).mockImplementation(() => ({  
save: jest.fn().mockResolvedValue(mockEmployee),  
}));  
const result = await service.hireEmployee(mockEmployee as Employee);  
expect(EmployeeModel.findById).toHaveBeenCalledWith(mockEmployee._id);  
expect(checkFiredEmployees).toHaveBeenCalledWith(mockEmployee._id);  
expect(result).toEqual(mockEmployee);  
})  
})

## Architecture

Client -->|HTTP| Express;  
Express --> Controllers;  
Controllers --> Services;  
Services -->|CRUD| MongoDB;

## Use Cases

**HR:** hires and fires employees and performs managerial functions.
**Employee:** starts and ends shifts and views their statistics.
**Manager:** monitors shift activity and generates reports on hours worked.
**Supervisor:** changes roles.

## Roadmap of project

* Adding JWT authorization
* Implementing roles (crew / manager / hr / supervisor)
* Developing and adapting authentication and authorization