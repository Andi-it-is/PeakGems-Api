import { Request, RequestHandler, Response } from "express";
import { AppDataSource } from "../../../AppDataSource";
import { Gathering } from "../../../entity/Gathering";

export const listAllGatherings: RequestHandler = async (req: Request, res: Response, next) => {

  try {

    const gatherings = await AppDataSource
      .getRepository(Gathering)
      .find({
        relations: {
          location: true,
          attendees: {
            user: true
          }
        },
        select: {
          id: true,
          title: true,
          description: true,
          startAt: true,
          createdAt: true,
          updatedAt: true,
          location: {
            id: true,
            name: true,
            type: true,
            address: true,
          },
          attendees: {
            id: true,
            status: true,
            updatedAt: true,
            user: {
              id: true,
              username: true,
              avatar: true,
            }
          }
        },
        order: {
          startAt: 'ASC'
        }
      })

    return res.status(200).json({
      success: true,
      data: gatherings,
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
