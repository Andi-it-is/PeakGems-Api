import { Request, RequestHandler, Response } from "express";
import { AppDataSource } from "../../../AppDataSource";
import * as Joi from "joi";
import { UserRequestHandler } from "../../../lib/classes/UserRequestHandler";
import { Location } from "../../../entity/Location";
import { Review } from "../../../entity/Review";

const paramSchema = Joi.object({
  id: Joi.string().required()
})

export const getReviewsByLocationId: RequestHandler = async (req: Request, res: Response, next) => {

  try {

    const params = await paramSchema.validateAsync(req.params)

    const location = await AppDataSource
      .getRepository(Location)
      .findOne({
        where: {
          id: params.id
        },
        relations: {
          reviews: {
            user: true // Tells TypeORM to load the user for every review
          }
        },
        select: {
          // 1. Keep all Location fields
          id: true,
          name: true,
          address: true,
          status: true,
          type: true,

          // 2. Keep all Review fields
          reviews: {
            id: true,
            comment: true,
            rating: true,
            visitedDate: true,
            orderedDish: true,

            // 3. Restrict User fields to only id username and avatar
            user: {
              id: true,
              username: true,
              avatar: true
            }
          }
        }
      })

    interface LocationWithRating extends Location {
      averageRating: number
      totalRatings: number
    }

    const reviews = location.reviews
    let avg = 0
    reviews.forEach((rev: Review) => {
      avg += rev.rating
    })
    if (Number.isNaN(avg) || !Number.isFinite(avg) || avg === null) {
      avg = 0;
    }
    if (reviews.length > 0) {
      avg = avg / reviews.length
    } else {
      avg = 0
    }
    const locationExpanded: LocationWithRating = {
      ...structuredClone(location),
      averageRating: avg,
      totalRatings: reviews.length
    };

    return res.status(200).json({
      success: true,
      data: locationExpanded,
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