import { Response } from "express";
import * as Joi from "joi";
import { AppDataSource } from "../../../AppDataSource";
import { GatheringAttendee } from "../../../entity/GatheringAttendee";
import { UserRequest, UserRequestHandler } from "../../../lib/classes/UserRequestHandler";

const paramSchema = Joi.object({
  id: Joi.required()
})

export const deleteAttendance: UserRequestHandler = async (req: UserRequest, res: Response) => {

  try {
    const params = await paramSchema.validateAsync(req.params)

    const result = await AppDataSource
      .getRepository(GatheringAttendee)
      .delete({
        gathering: { id: Number(params.id) },
        user: { id: req.user.id },
      })

    if (!result.affected) {
      return res.status(404).json({
        success: false,
        message: "No Attendance for the given Gathering was found.",
      })
    }

    return res.status(200).json({
      success: true,
      message: "Attendance successfully removed",
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
