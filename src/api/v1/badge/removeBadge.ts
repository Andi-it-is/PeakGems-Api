import { Request, RequestHandler, Response } from "express";
import { AppDataSource } from "../../../AppDataSource";
import * as Joi from "joi";
import { User } from "../../../entity/User";

const paramSchema = Joi.object({
  id: Joi.number().integer().required(),
  userId: Joi.number().integer().required(),
})

// Nimmt einem User ein Badge wieder weg. Hatte er es nicht, passiert nichts.
export const removeBadge: RequestHandler = async (req: Request, res: Response, next) => {

  try {
    const params = await paramSchema.validateAsync(req.params)

    await AppDataSource
      .createQueryBuilder()
      .relation(User, "badges")
      .of(params.userId)
      .remove(params.id)

    return res.status(200).json({
      success: true,
      message: "Badge successfully removed",
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
