import { Response } from "express";
import * as Joi from "joi";
import { AppDataSource } from "../../../AppDataSource";
import { User } from "../../../entity/User";
import { RefreshToken } from "../../../entity/RefreshToken";
import { UserRequest, UserRequestHandler } from "../../../lib/classes/UserRequestHandler";
import { hash } from "../../../lib/helpers/passwords";

const paramSchema = Joi.object({
  id: Joi.number().required()
})

const bodySchema = Joi.object({
  username: Joi.string().min(1).max(50).optional(),
  resetPassword: Joi.boolean().optional(), // Passwort wird auf das Startpasswort zurückgesetzt, Nutzer muss danach selbst ein neues vergeben
  disabled: Joi.boolean().optional()
}).or('username', 'resetPassword', 'disabled')

const DEFAULT_START_PASSWORD = 'KomplexesPasswortStart123!';

export const updateUser: UserRequestHandler = async (req: UserRequest, res: Response) => {
  try {
    const params = await paramSchema.validateAsync(req.params);
    const body = await bodySchema.validateAsync(req.body);

    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneBy({ id: params.id });

    if (!user) {
      return res.status(404).json({ success: false, message: 'Nutzer nicht gefunden' });
    }

    if (body.username !== undefined && body.username !== user.username) {
      const existingUser = await userRepository.findOneBy({ username: body.username });

      if (existingUser) {
        return res.status(409).json({ success: false, message: 'Username bereits vergeben' });
      }

      user.username = body.username;
    }

    if (body.resetPassword) {
      // Nutzer meldet sich mit dem Startpasswort an und wird danach zur Vergabe eines neuen Passworts aufgefordert.
      user.passwordHash = await hash(DEFAULT_START_PASSWORD);
      user.mustSetNewPassword = true;
      user.failedLoginTries = 0;
    }

    if (body.disabled !== undefined) {
      user.disabled = body.disabled;

      // Ein Reaktivieren durch den Admin soll den Nutzer nicht sofort wieder aussperren.
      if (!body.disabled) {
        user.failedLoginTries = 0;
      }
    }

    await userRepository.save(user);

    if (body.disabled === true) {
      // Alle Refresh-Tokens des Nutzers widerrufen, damit keine neuen Access-Tokens mehr ausgestellt werden können.
      await AppDataSource
        .createQueryBuilder()
        .update(RefreshToken)
        .set({ isActive: false })
        .where("userId = :userId", { userId: user.id })
        .execute();
    }

    return res.status(200).json({
      success: true,
      data: {
        id: user.id,
        username: user.username,
        role: user.role,
        disabled: user.disabled,
        mustSetNewPassword: user.mustSetNewPassword
      }
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
