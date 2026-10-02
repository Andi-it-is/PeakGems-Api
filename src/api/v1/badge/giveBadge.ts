import { Request, RequestHandler, Response } from "express";
import { AppDataSource } from "../../../AppDataSource";
import * as Joi from "joi";
import { CustomBadge } from "../../../entity/CustomBadge";
import { User } from "../../../entity/User";

const paramSchema = Joi.object({
  id: Joi.number().integer().required()
})

const bodySchema = Joi.object({
  userId: Joi.number().integer().required()
})

// Gibt einem User ein Badge. Hat er es schon, passiert nichts (jedes Badge höchstens einmal pro User).
export const giveBadge: RequestHandler = async (req: Request, res: Response, next) => {

  try {
    const params = await paramSchema.validateAsync(req.params)
    const body = await bodySchema.validateAsync(req.body)

    const badgeExists = await AppDataSource.getRepository(CustomBadge).existsBy({ id: params.id })
    if (!badgeExists) {
      return res.status(404).json({
        success: false,
        message: "No Badge under the given id was found.",
      })
    }

    const user = await AppDataSource
      .getRepository(User)
      .findOne({
        where: { id: body.userId },
        relations: { badges: true },
      })
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No User under the given id was found.",
      })
    }

    if (!user.badges.some(badge => badge.id === params.id)) {
      await AppDataSource
        .createQueryBuilder()
        .relation(User, "badges")
        .of(user.id)
        .add(params.id)
    }

    return res.status(200).json({
      success: true,
      message: "Badge successfully given",
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
