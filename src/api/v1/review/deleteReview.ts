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

export const deleteReview: UserRequestHandler = async (req: UserRequest, res: Response, next) => {

  try {
    const params = await paramSchema.validateAsync(req.params)

    if (req.role === UserRoleEnum.ADMIN) {
       
      const review = await AppDataSource
      .getRepository(Review)
      .delete(Number(params.id))
      
      await AppDataSource.manager.save(review)
      
    } else {
      return res.status(403).json({
        success: false,
        message: "Deleting Reviews is forbidden for users.",
    })
    }
    return res.status(200).json({
      success: true,
      message: "Review successfully deleted",
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