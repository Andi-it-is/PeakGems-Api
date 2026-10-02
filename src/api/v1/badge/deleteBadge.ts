import { Request, RequestHandler, Response } from "express";
import { AppDataSource } from "../../../AppDataSource";
import * as Joi from "joi";
import { CustomBadge } from "../../../entity/CustomBadge";

const paramSchema = Joi.object({
  id: Joi.number().integer().required()
})

// Löscht das Badge komplett - die Vergaben an User verschwinden per ON DELETE CASCADE mit
export const deleteBadge: RequestHandler = async (req: Request, res: Response, next) => {

  try {
    const params = await paramSchema.validateAsync(req.params)

    const result = await AppDataSource
      .getRepository(CustomBadge)
      .delete(params.id)

    if (!result.affected) {
      return res.status(404).json({
        success: false,
        message: "No Badge under the given id was found.",
      })
    }

    return res.status(200).json({
      success: true,
      message: "Badge successfully deleted",
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
