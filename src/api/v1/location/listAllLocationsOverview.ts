import { Request, RequestHandler, Response } from "express";
import { AppDataSource } from "../../../AppDataSource";
import * as Joi from "joi";
import { UserRequestHandler } from "../../../lib/classes/UserRequestHandler";
import { Location } from "../../../entity/Location";
import { Review } from "../../../entity/Review";

export const listAllLocationsOverview: RequestHandler  = async (req: Request, res: Response, next) => {

  try {
    

    const locations = await AppDataSource
      .getRepository(Location)
      .find({
        relations: ["reviews"],
        order: {
          id: 'ASC'
        }
    });
    
    let locationsWithAvgRating = structuredClone(locations);
    
    interface LocationWithRating extends Location {
      averageRating: number
      totalRatings: number
    }
    
    // determine avg rating of each location and add avg value and total amount of ratings to the response
    locationsWithAvgRating.forEach((loc: LocationWithRating) => {
      const reviews = loc.reviews
      let avg = 0
      reviews.forEach((rev: Review) => {
        avg += rev.rating
      })
      avg = avg / reviews.length
      if (Number.isNaN(avg) || !Number.isFinite(avg)) {
          avg = 0;
      }
      loc.averageRating = avg
      loc.totalRatings = reviews.length
      delete loc.reviews
    })

    return res.status(200).json({
      success: true,
      data: locationsWithAvgRating,
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