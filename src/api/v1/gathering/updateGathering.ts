import { Response } from "express";
import * as Joi from "joi";
import { AppDataSource } from "../../../AppDataSource";
import { Gathering } from "../../../entity/Gathering";
import { GatheringAttendee } from "../../../entity/GatheringAttendee";
import { Location } from "../../../entity/Location";
import { UserRequest, UserRequestHandler } from "../../../lib/classes/UserRequestHandler";

const paramSchema = Joi.object({
  id: Joi.required()
})

const bodySchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().allow('', null).optional(),
  startAt: Joi.date().required(),
  locationId: Joi.number().required(),
})

export const updateGathering: UserRequestHandler = async (req: UserRequest, res: Response) => {

  try {
    const params = await paramSchema.validateAsync(req.params)
    const body = await bodySchema.validateAsync(req.body)

    const gathering = await AppDataSource
      .getRepository(Gathering)
      .findOne({
        where: {
          id: Number(params.id),
        },
      })

    if (!gathering) {
      return res.status(404).json({
        success: false,
        message: "No Gathering under the given id was found.",
      })
    }

    const location = await AppDataSource.getRepository(Location).findOneBy({ id: body.locationId })

    if (!location) {
      return res.status(404).json({
        success: false,
        message: "No Location under the given id was found.",
      })
    }

    gathering.title = body.title
    gathering.description = body.description
    gathering.startAt = body.startAt
    gathering.location = location

    await AppDataSource.manager.save(gathering)
    await AppDataSource.getRepository(GatheringAttendee).delete({ gathering: { id: gathering.id } })

    return res.status(200).json({
      success: true,
      message: "Gathering successfully updated",
      data: gathering
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
