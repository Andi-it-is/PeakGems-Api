import { User } from "../../../entity/User";
import { AdminOnlyRequestHandler } from "../../../lib/classes/AdminRequest";

export const getAllUsers: AdminOnlyRequestHandler = async (req, res, next) => {
  
  try {
    console.log("admiiiiiiiin")
  } catch (error) {
    next(error)
  }
}