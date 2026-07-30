import { Response } from "express";
import { AppDataSource } from "../../../AppDataSource";
import * as Joi from "joi";
import { UserRequest, UserRequestHandler } from "../../../lib/classes/UserRequestHandler";
import { LocationImage } from "../../../entity/LocationImage";

const paramSchema = Joi.object({
  imageId: Joi.required(),
});

const bodySchema = Joi.object({
  altText: Joi.string().min(1).max(50).required(),
});

export const updateLocationImage: UserRequestHandler = async (req: UserRequest, res: Response) => {
  try {
    const params = await paramSchema.validateAsync(req.params);
    const body = await bodySchema.validateAsync(req.body);

    const imageRepo = AppDataSource.getRepository(LocationImage);
    const image = await imageRepo.findOneBy({ id: Number(params.imageId) });

    if (!image) {
      return res.status(404).json({
        success: false,
        message: "No Image under the given id was found.",
      });
    }

    image.altText = body.altText;
    await imageRepo.save(image);

    return res.status(200).json({
      success: true,
      image,
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
