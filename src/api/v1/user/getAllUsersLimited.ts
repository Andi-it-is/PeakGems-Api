import { AppDataSource } from "../../../AppDataSource";
import { User } from "../../../entity/User";
import { UserRequest, UserRequestHandler } from "../../../lib/classes/UserRequestHandler";

export const getAllUsersLimited: UserRequestHandler = async (req: UserRequest, res, next) => {

  try {

    const users = await AppDataSource
      .getRepository(User)
      .find({
        relations: {
          badges: true
        },
        select: {
          id: true,
          username: true,
          avatar: true,
          badges: {
            id: true,
            title: true,
            color: true,
            textColor: true
          }
        },
        order: {
          username: 'ASC',
          badges: {
            title: 'ASC'
          }
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
