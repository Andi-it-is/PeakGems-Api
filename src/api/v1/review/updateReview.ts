import { Request, RequestHandler, Response } from "express";
import { AppDataSource } from "../../../AppDataSource";
import * as Joi from "joi";
import { UserRequest, UserRequestHandler } from "../../../lib/classes/UserRequestHandler";
import { Location } from "../../../entity/Location";
import { Review } from "../../../entity/Review";
import { UserRoleEnum } from "../../../lib/enums/UserRoleEnum";

const paramSchema = Joi.object({
  id: Joi.required()
})

const bodySchema = Joi.object({
  visitedDate: Joi.required(),
  rating: Joi.number().required(),
  orderedDish: Joi.string(),
  comment: Joi.string().required(),
  id: Joi.optional(),
  user: Joi.optional()
})

export const updateReview: UserRequestHandler = async (req: UserRequest, res: Response, next) => {

  try {
    const body = await bodySchema.validateAsync(req.body)
    const params = await paramSchema.validateAsync(req.params)

    console.log("uuuuuu")
    const review = await AppDataSource
      .getRepository(Review)
      .findOne({
        where: {
          id: Number(params.id),
        }
      })
    console.log("revvvvvv", review, "und neuer ocntent ", body)

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "No Review found.",
      })
    }

    review.visitedDate = body.visitedDate
    review.rating = body.rating
    if (body.orderedDish) {
      review.orderedDish = body.orderedDish
    } else {
      review.orderedDish = 'Keine Angabe'
    }
    review.comment = body.comment

    await AppDataSource.manager.save(review)

    return res.status(200).json({
      success: true,
      message: "Review successfully updated",
    })

  } catch (error) {

    if (error.isJoi) {
      return res.status(400).json({
        status: "Validation Error",
        errors: error.details.map((detail: any) => detail.message)
      });
    } else {

      return res.status(500).json({
        message: "Internal server error"
      });
    }
  }
};