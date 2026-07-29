import { Response } from "express";
import { AppDataSource } from "../../../AppDataSource";
import { User } from "../../../entity/User";
import { UserRequest, UserRequestHandler } from "../../../lib/classes/UserRequestHandler";
import * as fs from "fs";
import * as path from "path";

export const removeAvatar: UserRequestHandler = async (req: UserRequest, res: Response) => {
  try {
    if (!req.user.avatar) {
      return res.status(200).json({
        success: true,
        message: "Kein Avatar gesetzt.",
      });
    }

    const filePath = path.join(__dirname, "../../../../uploads/avatars", path.basename(req.user.avatar));
    fs.unlink(filePath, (err) => {
      if (err) console.error("Konnte Avatarbild nicht löschen:", err);
    });

    req.user.avatar = null;
    await AppDataSource.getRepository(User).save(req.user);

    return res.status(200).json({
      success: true,
      message: "Avatar entfernt.",
    });

  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
