import {Response,Request} from "express"
import {ShiftControlServiceMongo as service} from "../services/ShiftControlServiceImplMongo.js"
import {HttpError} from "../errorHandler/HttpError.js";
import {logger} from "../../Logger/winston.js";


export const startShift = async (req: Request, res: Response) => {
    const {crew_table_num} = req.body;
    if (!crew_table_num) {
        throw new HttpError(400, 'No correct table num');
    }
    const result = await service.startShift(crew_table_num);
    res.status(201).json(result);
}
export const finishShift= async (req: Request, res: Response) => {
    const {crew_table_num} = req.body;
    if (!crew_table_num) {
        throw new HttpError(400, 'No correct table num');
    }
    const result = await service.finishShift(crew_table_num);
    res.status(200).json(result);
}
export const breaks= async (req: Request, res: Response) => {
    const {crew_table_num, breakDuration} = req.body;
    if (!crew_table_num) {
        throw new HttpError(400, 'No correct data');
    }
    const result = await service.breaks(crew_table_num, breakDuration);
    res.status(204).json(result);
}
export const correctShift= async (req: Request, res: Response) => {
    const {crew_table_num, manager_table_num, startShift, finishShift} = req.body;
    if (!crew_table_num || !manager_table_num || !startShift) throw new HttpError(400, 'No correct data');
    await service.correctShift({crew_table_num, manager_table_num, startShift, finishShift});
    res.status(200).json({message:"Data was successfully updated"});
}
export const getCurrentShiftStaff= async (req: Request, res: Response) => {
    try {
        const temp = await service.getCurrentShiftStaff();
        res.status(200).json(temp);
    } catch (e) {
        logger.error("Error receiving shift:", e);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
export const getCurrentActivityShift = async (req: Request, res: Response) => {
    try {
        const crew_table_num = req.params.crew_table_num as string;
        const result = await service.getCurrentActivityShift(crew_table_num);
        res.status(200).json(result);
    } catch (error) {
        logger.error("Error receiving shift:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
