import { Router } from "express";

import { userTokenChecker } from "../../lib/middleware/tokenChecker";
import authRouter from "./auth/router";
import userRouter from "./user/router";

const router = Router()

router.use("/auth", authRouter)

// router use token checker

router.use("/user", userTokenChecker, userRouter)

// saved routes

export default router;