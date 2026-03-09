import { AppDataSource } from "../../../AppDataSource";
import { User } from "../../../entity/User";
import { UserRequest, UserRequestHandler } from "../../../lib/classes/UserRequestHandler";
import { UserRoleEnum } from "../../../lib/enums/UserRoleEnum";

export const getAllUsers: UserRequestHandler = async (req: UserRequest, res, next) => {
  
  try {
    
    // if (req.user.role !== UserRoleEnum.ADMIN) {
    //   return res.status(403).json({
    //     success: false,
    //     message: "Admin Rechte werden benötigt."
    //   })
    // }

    const users = await AppDataSource
      .getRepository(User)
      .find()
    
    return res.status(200).json({
      success: true,
      data: users
    })
    
    
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}