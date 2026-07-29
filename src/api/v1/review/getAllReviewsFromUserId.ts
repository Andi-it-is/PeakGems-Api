import { Request, RequestHandler, Response } from "express";
import { AppDataSource } from "../../../AppDataSource";
import * as Joi from "joi";
import { UserRequestHandler } from "../../../lib/classes/UserRequestHandler";
import { Location } from "../../../entity/Location";
import { Review } from "../../../entity/Review";

const paramSchema = Joi.object({
  id: Joi.string().required()
})

export const getAllReviewsFromUserId: RequestHandler = async (req: Request, res: Response, next) => {

  try {

    const params = await paramSchema.validateAsync(req.params)

    const reviews = await AppDataSource
      .getRepository(Review)
      .find({
        where: {
          user: {
            id: Number(req.params.id)
          }
        },
        relations: ['location'],
        order: {
          id: 'DESC'
        }
      })

    return res.status(200).json({
      success: true,
      data: reviews,
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