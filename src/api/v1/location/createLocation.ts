import { Request, RequestHandler, Response } from "express";
import { AppDataSource } from "../../../AppDataSource";
import * as Joi from "joi";
import { UserRequestHandler } from "../../../lib/classes/UserRequestHandler";
import { Location } from "../../../entity/Location";
import { pointSchema } from "../../../lib/helpers/location";


const bodySchema = Joi.object({
  name: Joi.string().required(),
  address: Joi.string().required(),
  description: Joi.string().allow('', null).optional(),
  status: Joi.string().required(),
  type: Joi.string().required(),
  city: Joi.string().trim().max(255).required(),
  location: pointSchema.allow(null).optional(),
})

export const createLocation: RequestHandler  = async (req: Request, res: Response, next) => {

  try {
    const body = await bodySchema.validateAsync(req.body)

    const location = new Location()
    location.name = body.name
    location.address = body.address
    location.description = body.description
    location.status = body.status
    location.type = body.type
    location.city = body.city
    location.longitude = body.location ? body.location.coordinates[0] : null
    location.latitude = body.location ? body.location.coordinates[1] : null

    await AppDataSource.manager.save(location)

    return res.status(200).json({
      success: true,
      message: "Location successfully created",
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