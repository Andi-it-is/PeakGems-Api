import { Request, RequestHandler, Response } from "express";
import { AppDataSource } from "../../../AppDataSource";
import { Location } from "../../../entity/Location";

export const listAllLocationImages: RequestHandler = async (req: Request, res: Response, next) => {

  try {

    const locations = await AppDataSource
      .getRepository(Location)
      .find({
        relations: ['images'],
        order: {
          name: 'ASC'
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
