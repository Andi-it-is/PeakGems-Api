import { Request, RequestHandler, Response } from "express";
import { AppDataSource } from "../../../AppDataSource";
import { Location } from "../../../entity/Location";

export const listAllLocationsWithReviews: RequestHandler  = async (req: Request, res: Response, next) => {

  try {

    const locations = await AppDataSource
      .getRepository(Location)
      .find({
        relations: {
          reviews: {
            user: true
          }
        },
        select: {
          id: true,
          name: true,
          address: true,
          description: true,
          status: true,
          type: true,
          createdAt: true,
          updatedAt: true,
          reviews: {
            id: true,
            rating: true,
            visitedDate: true,
            orderedDish: true,
            comment: true,
            createdAt: true,
            updatedAt: true,
            user: {
              id: true,
              username: true,
              avatar: true
            }
          }
        },
        order: {
          id: 'ASC'
        }
      })

    return res.status(200).json({
      success: true,
      data: locations,
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
