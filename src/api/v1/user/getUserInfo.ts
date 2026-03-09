import { AppDataSource } from "../../../AppDataSource";
import { User } from "../../../entity/User";
import { UserRequest, UserRequestHandler } from "../../../lib/classes/UserRequestHandler";

export const getUserInfo: UserRequestHandler = async (req: UserRequest, res, next) => {
  
  try {

    const user = await AppDataSource
      .getRepository(User)
      .findOne({
        where: {
          id: req.user.id
        }
      })
    
    return res.status(200).json({
      success: true,
      username: user.username,
      role: user.role,
      userId: user.id
    })

  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}