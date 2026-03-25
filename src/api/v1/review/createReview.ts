import { Request, RequestHandler, Response } from "express";
import { AppDataSource } from "../../../AppDataSource";
import * as Joi from "joi";
import { UserRequest, UserRequestHandler } from "../../../lib/classes/UserRequestHandler";
import { Location } from "../../../entity/Location";
import { Review } from "../../../entity/Review";


const bodySchema = Joi.object({
  visitedDate: Joi.required(),
  rating: Joi.number().required(),
  orderedDish: Joi.string(),
  comment: Joi.string().required(),
  locationId: Joi.number().required()
})

export const createReview: UserRequestHandler = async (req: UserRequest, res: Response, next) => {

  try {
    const body = await bodySchema.validateAsync(req.body)

    const review = new Review()
    review.rating = body.rating
    review.comment = body.comment

    if (body.orderedDish) {
      review.orderedDish = body.orderedDish
    } else {
      review.orderedDish = 'Keine Angabe'
    }
    review.visitedDate = body.visitedDate
    review.location = body.locationId

    review.user = req.user

    await AppDataSource.manager.save(review)

    return res.status(200).json({
      success: true,
      message: "Review successfully created",
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