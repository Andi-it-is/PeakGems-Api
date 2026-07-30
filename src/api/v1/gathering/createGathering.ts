import { Response } from "express";
import * as Joi from "joi";
import { AppDataSource } from "../../../AppDataSource";
import { Gathering } from "../../../entity/Gathering";
import { Location } from "../../../entity/Location";
import { UserRequest, UserRequestHandler } from "../../../lib/classes/UserRequestHandler";

const bodySchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().allow('', null).optional(),
  startAt: Joi.date().required(),
  locationId: Joi.number().required(),
})

export const createGathering: UserRequestHandler = async (req: UserRequest, res: Response) => {

  try {
    const body = await bodySchema.validateAsync(req.body)

    const location = await AppDataSource.getRepository(Location).findOneBy({ id: body.locationId })

    if (!location) {
      return res.status(404).json({
        success: false,
        message: "No Location under the given id was found.",
      })
    }

    const gathering = new Gathering()
    gathering.title = body.title
    gathering.description = body.description
    gathering.startAt = body.startAt
    gathering.location = location

    await AppDataSource.manager.save(gathering)

    return res.status(200).json({
      success: true,
      data: gathering,
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
