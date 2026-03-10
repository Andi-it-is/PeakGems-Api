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

export const deleteLocation: UserRequestHandler = async (req: UserRequest, res: Response, next) => {

  try {
    const params = await paramSchema.validateAsync(req.params)

    if (req.role === UserRoleEnum.ADMIN) {

      const location = await AppDataSource
      .getRepository(Location)
      .delete(Number(params.id))
      
      
      if (!location) {
        return res.status(404).json({
          success: false,
          message: "No Location under the given id was found.",
        })
      }
      
      await AppDataSource.manager.save(location)

      return res.status(200).json({
        success: true,
        message: "Review successfully deleted",
      })

    } else {
      return res.status(403).json({
        success: false,
        message: "Deleting Locations is forbidden for users.",
    })
    }

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