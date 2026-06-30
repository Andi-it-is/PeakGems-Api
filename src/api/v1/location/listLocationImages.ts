import { Response } from "express";
import { AppDataSource } from "../../../AppDataSource";
import * as Joi from "joi";
import { UserRequest, UserRequestHandler } from "../../../lib/classes/UserRequestHandler";
import { LocationImage } from "../../../entity/LocationImage";

const paramSchema = Joi.object({
  id: Joi.required(),
});

export const listLocationImages: UserRequestHandler = async (req: UserRequest, res: Response) => {
  try {
    const params = await paramSchema.validateAsync(req.params);

    const images = await AppDataSource.getRepository(LocationImage).find({
      where: { locationId: Number(params.id) },
      order: { createdAt: "ASC" },
    });

    return res.status(200).json({
      success: true,
      images,
    });

  } catch (error) {
    if (error.isJoi) {
      return res.status(400).json({
        status: "Validation Error",
        errors: error.details.map((detail: any) => detail.message),
      });
    } else {
      return res.status(500).json({
        message: "Internal server error",
      });
    }
  }
};