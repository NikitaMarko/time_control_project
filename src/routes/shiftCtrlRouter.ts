import express from "express";
import * as controller from "../controllers/shiftController.js"
import {bodyValidation} from "../validation/bodyValidation.js";
import {breaksSchema, correctShiftSchema, shiftSchema} from "../validation/joiSchema.js";

export const shiftCtrlRouter = express.Router();

shiftCtrlRouter.get('/activity/:crew_table_num',controller.getCurrentActivityShift);
shiftCtrlRouter.get('/staff',controller.getCurrentShiftStaff);
shiftCtrlRouter.put('/correct',bodyValidation(correctShiftSchema),controller.correctShift);
shiftCtrlRouter.patch('/breaks',bodyValidation(breaksSchema),controller.breaks);
shiftCtrlRouter.put('/start_staff',bodyValidation(shiftSchema),controller.startShift);
shiftCtrlRouter.put('/finish_staff',bodyValidation(shiftSchema),controller.finishShift);
