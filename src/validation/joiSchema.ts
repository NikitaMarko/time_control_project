import Joi from "joi";

export const shiftSchema = Joi.object({
    crew_table_num:Joi.string().required()
})
export const breaksSchema = Joi.object({
    crew_table_num:Joi.string().required(),
    breakDuration:Joi.number().required()
})
export const correctShiftSchema = Joi.object({
    crew_table_num: Joi.string().required(),
    manager_table_num: Joi.string().required(),
    startShift: Joi.number().required(),
    finishShift: Joi.number().required()
})