import { Response } from "express";
import { AppDataSource } from "../../../AppDataSource";
import * as Joi from "joi";
import { UserRequest, UserRequestHandler } from "../../../lib/classes/UserRequestHandler";
import { Location } from "../../../entity/Location";
import { LocationImage } from "../../../entity/LocationImage";
import { UserRoleEnum } from "../../../lib/enums/UserRoleEnum";

const paramSchema = Joi.object({
  id: Joi.required(),
});

const bodySchema = Joi.object({
  altText: Joi.string().min(1).max(50).required(),
});

export const uploadLocationImages: UserRequestHandler = async (req: UserRequest, res: Response) => {
  try {
    const params = await paramSchema.validateAsync(req.params);
    const body = await bodySchema.validateAsync(req.body);

    const files = (req as any).files as Express.Multer.File[];

    if (!files || files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Keine Dateien hochgeladen.",
      });
    }

    const location = await AppDataSource.getRepository(Location).findOneBy({
      id: Number(params.id),
    });

    if (!location) {
      return res.status(404).json({
        success: false,
        message: "No Location under the given id was found.",
      });
    }

    const imageRepo = AppDataSource.getRepository(LocationImage);

    const images = files.map((file) =>
      imageRepo.create({
        filename: file.filename,
        url: `/uploads/locations/${file.filename}`, // TODO: an euer Storage-Setup anpassen
        altText: body.altText,
        locationId: location.id,
      }),
    );

    const savedImages = await imageRepo.save(images);

    return res.status(201).json({
      success: true,
      images: savedImages,
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