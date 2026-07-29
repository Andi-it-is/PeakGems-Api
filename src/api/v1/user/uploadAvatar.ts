import { Response } from "express";
import { AppDataSource } from "../../../AppDataSource";
import { User } from "../../../entity/User";
import { UserRequest, UserRequestHandler } from "../../../lib/classes/UserRequestHandler";
import * as fs from "fs";
import * as path from "path";

export const uploadAvatar: UserRequestHandler = async (req: UserRequest, res: Response) => {
  try {
    const file = (req as any).file as Express.Multer.File;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "Keine Datei hochgeladen.",
      });
    }

    if (req.user.avatar) {
      const oldFilePath = path.join(__dirname, "../../../../uploads/avatars", path.basename(req.user.avatar));
      fs.unlink(oldFilePath, (err) => {
        if (err) console.error("Konnte altes Avatarbild nicht löschen:", err);
      });
    }

    req.user.avatar = `/uploads/avatars/${file.filename}`;
    await AppDataSource.getRepository(User).save(req.user);

    return res.status(200).json({
      success: true,
      avatar: req.user.avatar,
    });

  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
