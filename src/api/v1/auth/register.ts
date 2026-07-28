import { Request, RequestHandler, Response } from "express";
import { AppDataSource } from "../../../AppDataSource";
import { User } from "../../../entity/User";
import * as bcrypt from "bcrypt";
import * as Joi from "joi";
import { APIError } from "../../../lib/classes/APIError";
import { hash } from "../../../lib/helpers/passwords";
import { UserRoleEnum } from "../../../lib/enums/UserRoleEnum";
import { toPublicUser } from "../../../lib/helpers/user";

const bodySchema = Joi.object({
  username: Joi.string().required().min(3).max(50),
  password: Joi.string().min(3).max(50).required(),
  passwordRepeat: Joi.string().min(3).max(50).required(),
})


export const registerUser: RequestHandler = async (req: Request, res: Response, next) => {

  try {
    const body = await bodySchema.validateAsync(req.body)

    if (body.password !== body.passwordRepeat) {
      throw new APIError("Passwörter müssen gleich sein", "s.o.", 403)
    }

    const existingUser = await AppDataSource
      .getRepository(User)
      .findOne({
        where: {
          username: body.username
        }
      })

    if (existingUser) {
      throw APIError.errorUserAlreadyExists()
    }

    const hashedPassword = await hash(body.password);

    const user = new User()
    user.username = body.username
    user.passwordHash = hashedPassword

    // initally create acounts as User
    user.role = UserRoleEnum.USER

    await AppDataSource.manager.save(user)

    return res.status(200).json({
      success: true,
      user: toPublicUser(user)
    })

  } catch (error) {

    if (error.isJoi) {
      return res.status(400).json({
        status: "Validation Error",
        errors: error.details.map((detail: any) => detail.message)
      });
    } else if (error instanceof APIError) {

      return res.status(error.status).json({
        title: error.title,
        message: error.message,
        data: error.data
      });
    } else {

      return res.status(500).json({
        message: "Internal server error",
        error: error
      });
    }
  }
};