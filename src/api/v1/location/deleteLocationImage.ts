import { Response } from "express";
import { AppDataSource } from "../../../AppDataSource";
import * as Joi from "joi";
import { UserRequest, UserRequestHandler } from "../../../lib/classes/UserRequestHandler";
import { LocationImage } from "../../../entity/LocationImage";
import * as fs from "fs";
import * as path from "path";

const paramSchema = Joi.object({
  imageId: Joi.required(),
});

export const deleteLocationImage: UserRequestHandler = async (req: UserRequest, res: Response) => {
  try {
    const params = await paramSchema.validateAsync(req.params);

    const imageRepo = AppDataSource.getRepository(LocationImage);
    const image = await imageRepo.findOneBy({ id: Number(params.imageId) });

    if (!image) {
      return res.status(404).json({
        success: false,
        message: "No Image under the given id was found.",
      });
    }

    // TODO: an euer tatsächliches Storage-Setup anpassen (z.B. S3-Delete statt fs.unlink)
    const filePath = path.join(__dirname, "../../../../uploads/locations", image.filename);
    fs.unlink(filePath, (err) => {
      if (err) console.error("Konnte Datei nicht löschen:", err);
    });

    const result = await imageRepo.delete(image.id);

    if (!result.affected) {
      return res.status(404).json({
        success: false,
        message: "No Image under the given id was found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Image successfully deleted",
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