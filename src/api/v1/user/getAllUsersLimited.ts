import { AppDataSource } from "../../../AppDataSource";
import { User } from "../../../entity/User";
import { UserRequest, UserRequestHandler } from "../../../lib/classes/UserRequestHandler";

export const getAllUsersLimited: UserRequestHandler = async (req: UserRequest, res, next) => {

  try {

    const users = await AppDataSource
      .getRepository(User)
      .find({
        select: {
          id: true,
          username: true,
          avatar: true
        },
        order: {
          username: 'ASC'
        }
      })

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
