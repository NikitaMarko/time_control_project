# Time Control Project

## Introduction

Time Control Project is a mini-project that provides a REST API for recording workday start
and end times, managing employees, calculating hours worked, and generating reports.

## Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Language:** TypeScript
- **Testing:** Jest
- **Validation:** Joi
- **Logging:** Winston

*Note: Containerization with Docker is not currently used.*

## Start of project

### Prerequisites

- Node.js installed (v18.x or higher recommended)
- Access to a MongoDB cluster

### Installation and Startup

1. Clone the repository:
```bash
git clone https://github.com/your_username/time-control-project.git
cd time-control-project
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the project's root directory and fill it with your data:
```env
db=mongodb+srv://<user>:<password>@cluster.mongodb.net/employee?retryWrites=true&w=majority
JWT_SEKRET=super-secret-key-for-jwt-token
JWT_EXP=1h
LOG_LEVEL=info
```

4. Run the server in development mode:
```bash
npm run dev
```
The server will be runs at `http://localhost:3023`.

## Security

The following mechanisms are implemented in the project to ensure security:

- **Authentication and authorization:** We plan to implement JWT tokens.
- **Password hashing:** User passwords are stored as hashes.
- **Input validation:** The Joy library is used.
- **Centralized error handling:** A customized errorHandler is used.
- **Logging:** The Winston library is used.

## API Endpoint Description

The project provides a REST API for managing employees and their shifts. The main endpoint groups are:

- `/employee` — employee operations (hiring, firing, data updates).
- `/shift` — shift operations (start, end, reports).

#### Example request:

POST /employee/  
Content-Type: application/json  
```
{  
"firstName": "John",  
"lastName": "Snow",  
"password": "12345"  
}
```

#### Example response:
```
{  
"firstName": "John",
"lastName": "Snow",
"_id": "9ef344e3-075e-469e-a737-3a962c83e8a1",
"table_num": "TAB-1758135826083",
"roles": "crew",
"hash": fgd5FeR0-9E2aq123-rfCCb
}
```

#### Example request:

PUT /shift/start_staff  
Content-Type: application/json  
```
{
"crew_table_num":"TAB-1000000000002"
}
```

#### Example response:
```
{
"crew_table_num": "TAB-1000000000004",
"time": "1758137992194"
}
```

> **For complete and detailed documentation of all endpoints, parameters,
    and response codes, please refer to the [API documentation](/docs).**

## Testing

The project uses **Jest** for unit testing. To run all tests, run the command:
```bash
npm test
```

## Architecture

The request processing flow looks like this:
```
Client --> |HTTP Request| --> Express.js Router --> Controller --> Service --> |CRUD| --> MongoDB
```
## Structure of the project

Time_Control_Project/
├── .env
├── package.json
├── tsconfig.json
├── app-config/
│ └── app-config.json
├── docs/
│ └── openapi.json
├── Logger/
│ └── winston.ts
├── src/
│ ├── app.ts # App initialization
│ ├── server.ts # Server entry point
│ ├── config/ # App configuration (DB, etc.)
│ ├── controllers/ # Request handlers
│ │ ├── accountController.ts
│ │ └── shiftController.ts
│ ├── errorHandler/ # Centralized error handling
│ ├── middleware/ # Auth, validation, logging middlewares
│ ├── model/ # Domain models and schemas
│ │ ├── Employee.ts
│ │ ├── EmployeeMongooseSchema.ts
│ │ ├── Shift.ts
│ │ └── ShiftMongooseSchema.ts
│ ├── routes/ # Route definitions
│ │ ├── emplRouter.ts
│ │ └── shiftCtrlRouter.ts
│ ├── services/ # Business logic layer
│ │ ├── AccountService.ts
│ │ ├── AccountServiceImplMongo.ts
│ │ ├── ShiftControlService.ts
│ │ └── ShiftControlServiceImplMongo.ts
│ ├── utils/ # Helper functions
│ └── validation/ # Request DTO validation
└── tests/ # Unit and integration tests

## Use Cases

**HR:** hires and fires employees and performs managerial functions.
**Employee:** starts and ends shifts and views their statistics.
**Manager:** monitors shift activity and generates reports on hours worked.
**Supervisor:** changes roles.

## Roadmap of project

* Adding JWT authorization
* Implementing roles (crew / manager / hr / supervisor)
* Developing and adapting authentication and authorization