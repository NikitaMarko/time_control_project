import express from "express";
import * as controller from "../controllers/accountController.js"


export const employeeRouter = express.Router();


employeeRouter.patch("/password",controller.changePassword);
employeeRouter.delete("/:empId", controller.fireEmployee);
employeeRouter.put("/:empId", controller.updateEmployee);
employeeRouter.post("/",controller.hireEmployee);
employeeRouter.get("/:id",controller.getEmployeeById);
employeeRouter.get("/", controller.getAllEmployees);
employeeRouter.put("/roles/:id/:newRole", controller.setRole);