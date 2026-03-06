import { User } from "../../../entity/User";
import { UserRequestHandler } from "../../../lib/classes/UserRequest";

export const getUserInfo: UserRequestHandler = async (req, res, next) => {
  
  try {
    console.log("ich will user infos bekommen")
  } catch (error) {
    next(error)
  }
}