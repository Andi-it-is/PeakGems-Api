import { Router } from "express";

import { userTokenChecker } from "../../lib/middleware/tokenChecker";
import authRouter from "./auth/router";
import userRouter from "./user/router";
import locationRouter from "./location/router";
import reviewRouter from "./review/router";

const router = Router()
/**
 * * unatuhorized routes. These are publically available.
 */
router.use("/auth", authRouter)

// router.use("/review", reviewRouter)

/**
 * * every router after this will have the middleware applied.
 * * These are protected routes.
*/
// router.use(userTokenChecker)

/**
 * * protected routes.
*/
// router.use("/location", userTokenChecker, locationRouter)
router.use("/location", userTokenChecker, locationRouter)
router.use("/review", userTokenChecker, reviewRouter)
// router.use("/user", userTokenChecker, userRouter)

// saved routes

export default router;