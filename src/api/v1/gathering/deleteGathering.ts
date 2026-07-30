import { Response } from "express";
import * as Joi from "joi";
import { AppDataSource } from "../../../AppDataSource";
import { Gathering } from "../../../entity/Gathering";
import { UserRequest, UserRequestHandler } from "../../../lib/classes/UserRequestHandler";

const paramSchema = Joi.object({
  id: Joi.required()
})

export const deleteGathering: UserRequestHandler = async (req: UserRequest, res: Response) => {

  try {
    const params = await paramSchema.validateAsync(req.params)

    const result = await AppDataSource
      .getRepository(Gathering)
      .delete(Number(params.id))

    if (!result.affected) {
      return res.status(404).json({
        success: false,
        message: "No Gathering under the given id was found.",
      })
    }

    return res.status(200).json({
      success: true,
      message: "Gathering successfully deleted",
    })

  } catch (error) {

    if (error.isJoi) {
      return res.status(400).json({
        status: "Validation Error",
        errors: error.details.map((detail: any) => detail.message)
      });
    } else {
      return res.status(500).json({
        message: "Internal server error",
      });
    }
  }
};
