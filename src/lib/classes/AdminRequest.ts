import { NextFunction, Request, Response } from "express";
import { User } from "../../entity/User";
import { UserRoleEnum } from "../enums/UserRoleEnum";

export interface AdminOnlyRequest extends Request {
  user: User,
  role: UserRoleEnum.ADMIN
}

export type AdminOnlyRequestHandler = (req: AdminOnlyRequest, res: Response, next: NextFunction) => unknown;