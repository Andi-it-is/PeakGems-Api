import { Response } from "express";
import * as Joi from "joi";
import { AppDataSource } from "../../../AppDataSource";
import { User } from "../../../entity/User";
import { UserRequest, UserRequestHandler } from "../../../lib/classes/UserRequestHandler";
import { hash } from "../../../lib/helpers/passwords";

const bodySchema = Joi.object({
  password: Joi.string().min(4).max(30).required(),
  passwordRepeat: Joi.string().min(4).max(30).required(),
})

export const setNewPasswordAfterReset: UserRequestHandler = async (req: UserRequest, res: Response) => {
  try {
    const body = await bodySchema.validateAsync(req.body);

    if (!req.user.mustSetNewPassword) {
      return res.status(400).json({
        success: false,
        message: "Für diesen Account ist aktuell kein neues Passwort erforderlich."
      });
    }

    if (body.password !== body.passwordRepeat) {
      return res.status(400).json({
        success: false,
        message: "Passwörter müssen übereinstimmen."
      });
    }

    req.user.passwordHash = await hash(body.password);
    req.user.mustSetNewPassword = false;
    req.user.failedLoginTries = 0;

    await AppDataSource.getRepository(User).save(req.user);

    return res.status(200).json({
      success: true,
      message: "Passwort wurde erfolgreich gesetzt."
    });

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
