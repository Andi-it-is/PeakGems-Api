import { Request, RequestHandler, Response } from "express";
import { AppDataSource } from "../../../AppDataSource";
import * as Joi from "joi";
import { UserRequest, UserRequestHandler } from "../../../lib/classes/UserRequestHandler";
import { Location } from "../../../entity/Location";
import { LocationImage } from "../../../entity/LocationImage";
import { Review } from "../../../entity/Review";
import { Gathering } from "../../../entity/Gathering";
import { UserRoleEnum } from "../../../lib/enums/UserRoleEnum";
import * as fs from "fs";
import * as path from "path";

const paramSchema = Joi.object({
  id: Joi.required()
})

export const deleteLocation: UserRequestHandler = async (req: UserRequest, res: Response, next) => {

  try {
    const params = await paramSchema.validateAsync(req.params)

    if (req.role === UserRoleEnum.ADMIN) {

      const reviewCount = await AppDataSource.getRepository(Review).countBy({ location: { id: Number(params.id) } });
      const gatheringCount = await AppDataSource.getRepository(Gathering).countBy({ location: { id: Number(params.id) } });

      if (reviewCount > 0 || gatheringCount > 0) {
        return res.status(409).json({
          success: false,
          message: "Location kann nicht gelöscht werden, solange noch Reviews oder Gatherings darauf verweisen.",
        })
      }

      const imageRepo = AppDataSource.getRepository(LocationImage);
      const images = await imageRepo.findBy({ locationId: Number(params.id) });

      const result = await AppDataSource
        .getRepository(Location)
        .delete(Number(params.id))

      if (!result.affected) {
        return res.status(404).json({
          success: false,
          message: "No Location under the given id was found.",
        })
      }

      // Bilddateien der Location von der Platte entfernen (DB-Zeilen sind bereits per ON DELETE CASCADE weg)
      for (const image of images) {
        const filePath = path.join(__dirname, "../../../../uploads/locations", image.filename);
        fs.unlink(filePath, (err) => {
          if (err) console.error("Konnte Bilddatei nicht löschen:", err);
        });
      }

      return res.status(200).json({
        success: true,
        message: "Location successfully deleted",
      })

    } else {
      return res.status(403).json({
        success: false,
        message: "Deleting Locations is forbidden for users.",
      })
    }

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