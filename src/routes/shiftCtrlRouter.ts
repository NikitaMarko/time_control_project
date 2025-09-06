import express from "express";
import * as controller from "../controllers/shiftController.js"

export const shiftCtrlRouter = express.Router();

shiftCtrlRouter.get('/activity',controller.getCurrentActivityShift);
shiftCtrlRouter.get('/staff',controller.getCurrentShiftStaff);
shiftCtrlRouter.put('/correct',controller.correctShift);
shiftCtrlRouter.patch('/breaks',controller.breaks);
shiftCtrlRouter.put('/start_staff',controller.startShift);
shiftCtrlRouter.put('/finish_staff',controller.finishShift);
