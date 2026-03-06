import { Router } from "express";

// import token checker
import authRouter from "./auth/router";
import userRouter from "./user/router";

const router = Router()

router.use("/auth", authRouter)

// router use token checker

router.use("/user", userRouter)

// saved routes

export default router;