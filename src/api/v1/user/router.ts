import { Router, Request, Response } from 'express';
import { getAllUsers } from './getAllUsers';

const userRouter = Router();

userRouter.get('/all', getAllUsers)

export default userRouter;