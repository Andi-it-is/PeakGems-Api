import { Request, RequestHandler, Response } from "express";
import { AppDataSource } from "../../../AppDataSource";
import * as Joi from "joi";
import { CustomBadge } from "../../../entity/CustomBadge";

const paramSchema = Joi.object({
  id: Joi.number().integer().required()
})

const bodySchema = Joi.object({
  title: Joi.string().trim().max(50).required(),
  // Hex-Farben "#rrggbb"
  color: Joi.string().trim().pattern(/^#[0-9a-fA-F]{6}$/).required(),
  textColor: Joi.string().trim().pattern(/^#[0-9a-fA-F]{6}$/).required(),
})

export const updateBadge: RequestHandler = async (req: Request, res: Response, next) => {

  try {
    const params = await paramSchema.validateAsync(req.params)
    const body = await bodySchema.validateAsync(req.body)

    const badge = await AppDataSource
      .getRepository(CustomBadge)
      .findOneBy({ id: params.id })

    if (!badge) {
      return res.status(404).json({
        success: false,
        message: "No Badge under the given id was found.",
      })
    }

    badge.title = body.title
    badge.color = body.color
    badge.textColor = body.textColor

    await AppDataSource.manager.save(badge)

    return res.status(200).json({
      success: true,
      message: "Badge successfully updated",
      data: { id: badge.id, title: badge.title, color: badge.color, textColor: badge.textColor },
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
