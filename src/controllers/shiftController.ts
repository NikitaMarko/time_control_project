import {Response,Request} from "express"
import {ShiftControlServiceMongo as service} from "../services/ShiftControlServiceImplMongo.js"
import {HttpError} from "../errorHandler/HttpError.js";


export const startShift = async (req: Request, res: Response) => {
    const {table_num} = req.body;
    if (!table_num) {
        throw new HttpError(400, 'No correct table num');
    }
    const result = await service.startShift(table_num);
    res.status(201).json(result);
}
export const finishShift= async (req: Request, res: Response) => {
    const {table_num} = req.body;
    if (!table_num) {
        throw new HttpError(400, 'No correct table num');
    }
    const result = await service.finishShift(table_num);
    res.status(200).json(result);
}
export const breaks= async (req: Request, res: Response) => {
    const {table_num, breakDuration} = req.body;
    if (!table_num) {
        throw new HttpError(400, 'No correct data');
    }
    const result = await service.breaks(table_num, breakDuration);
    res.status(204).json(result);
}
export const correctShift= async (req: Request, res: Response) => {
    const {crew_table_num, manager_table_num, startShift, finishShift} = req.body;
    if (
        !crew_table_num || typeof crew_table_num !== 'string' ||
        !manager_table_num || typeof manager_table_num !== 'string' ||
        !startShift || typeof startShift !== 'number'
    ) throw new HttpError(400, 'No correct data');
    await service.correctShift({crew_table_num, manager_table_num, startShift, finishShift});
    res.status(200).json({message:"Data was successfully updated"});
}
export const getCurrentShiftStaff= async (req: Request, res: Response) => {
    const temp = await service.getCurrentShiftStaff();
    res.json(temp);
}
export const getCurrentActivityShift= async (req: Request, res: Response) => {
    const activeShift = req.params.activeShift;
    const result = await service.getCurrentActivityShift(activeShift);
    res.json(result);

}
