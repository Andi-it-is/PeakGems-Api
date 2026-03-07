import { Request, RequestHandler, Response } from "express";
import { AppDataSource } from "../../../AppDataSource";
import * as Joi from "joi";
import { UserRequestHandler } from "../../../lib/classes/UserRequestHandler";
import { Location } from "../../../entity/Location";


const bodySchema = Joi.object({
  name: Joi.string().required(),
  address: Joi.string().required(),
  status: Joi.string().required(),
  type: Joi.string().required()
})

export const createLocation: RequestHandler  = async (req: Request, res: Response, next) => {

  try {
    const body = await bodySchema.validateAsync(req.body)
    
    const location = new Location()
    location.name = body.name
    location.address = body.address
    location.status = body.status
    location.type = body.type

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