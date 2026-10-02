import { Request, RequestHandler, Response } from "express";
import { AppDataSource } from "../../../AppDataSource";
import { CustomBadge } from "../../../entity/CustomBadge";

export const listAllBadges: RequestHandler = async (req: Request, res: Response, next) => {

  try {

    const badges = await AppDataSource
      .getRepository(CustomBadge)
      .find({
        select: {
          id: true,
          title: true,
          color: true,
          textColor: true,
        },
        order: {
          title: 'ASC'
        }
      })

    return res.status(200).json({
      success: true,
      data: badges,
    })

  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
