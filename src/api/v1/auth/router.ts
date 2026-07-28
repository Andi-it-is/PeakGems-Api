import { Router, Request, Response } from 'express';
// import { login } from './login';
import { registerUser } from './register';
import { login } from './login';
import { userTokenChecker } from '../../../lib/middleware/tokenChecker';

const authRouter = Router();

authRouter.post('/login', login)
authRouter.post('/register', registerUser)

export default authRouter;