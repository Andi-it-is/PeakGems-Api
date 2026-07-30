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
  name: Joi.string().required(),
  address: Joi.string().required(),
  description: Joi.string().allow('', null).optional(),
  status: Joi.string().required(),
  type: Joi.string().required()
}).unknown(true)

export const updateLocation: UserRequestHandler = async (req: UserRequest, res: Response, next) => {

  try {
    const body = await bodySchema.validateAsync(req.body)
    const params = await paramSchema.validateAsync(req.params)

    const location = await AppDataSource
      .getRepository(Location)
      .findOne({
        where: {
          id: Number(params.id),
        },
      })
    
    if (!location) {
      return res.status(404).json({
        success: false,
        message: "No Location under the given id was found.",
      })
    }

    location.name = body.name
    location.address = body.address
    location.description = body.description

    location.status = body.status
    location.type = body.type
  

    await AppDataSource.manager.save(location)

    return res.status(200).json({
      success: true,
      message: "Location successfully updated",
      data: location
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