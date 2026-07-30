import { Response } from "express";
import * as Joi from "joi";
import { AppDataSource } from "../../../AppDataSource";
import { Gathering } from "../../../entity/Gathering";
import { GatheringAttendee } from "../../../entity/GatheringAttendee";
import { GatheringAttendanceStatusEnum } from "../../../lib/enums/GatheringAttendanceStatusEnum";
import { UserRequest, UserRequestHandler } from "../../../lib/classes/UserRequestHandler";

const paramSchema = Joi.object({
  id: Joi.required()
})

const bodySchema = Joi.object({
  status: Joi.string().valid(...Object.values(GatheringAttendanceStatusEnum)).required(),
})

export const setAttendance: UserRequestHandler = async (req: UserRequest, res: Response) => {

  try {
    const params = await paramSchema.validateAsync(req.params)
    const body = await bodySchema.validateAsync(req.body)

    const gathering = await AppDataSource.getRepository(Gathering).findOneBy({ id: Number(params.id) })

    if (!gathering) {
      return res.status(404).json({
        success: false,
        message: "No Gathering under the given id was found.",
      })
    }

    const attendeeRepo = AppDataSource.getRepository(GatheringAttendee)

    let attendee = await attendeeRepo.findOne({
      where: {
        gathering: { id: gathering.id },
        user: { id: req.user.id },
      },
    })

    if (attendee) {
      attendee.status = body.status
    } else {
      attendee = new GatheringAttendee()
      attendee.gathering = gathering
      attendee.user = req.user
      attendee.status = body.status
    }

    await attendeeRepo.save(attendee)

    return res.status(200).json({
      success: true,
      data: {
        id: attendee.id,
        status: attendee.status,
      },
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
