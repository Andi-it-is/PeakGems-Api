import { AppDataSource } from "../../../AppDataSource";
import { User } from "../../../entity/User";
import { UserRequest, UserRequestHandler } from "../../../lib/classes/UserRequestHandler";

export const getLeaderboard: UserRequestHandler = async (req: UserRequest, res, next) => {

  try {

    const users = await AppDataSource
      .getRepository(User)
      .createQueryBuilder("user")
      .loadRelationCountAndMap("user.reviewCount", "user.reviews")
      .getMany()

    const data = users
      .map((user: any) => ({
        id: user.id,
        username: user.username,
        avatar: user.avatar,
        reviewCount: user.reviewCount
      }))
      .sort((a, b) => b.reviewCount - a.reviewCount)

    return res.status(200).json({
      success: true,
      data
    })


  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}
