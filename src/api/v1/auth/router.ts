import { Router, Request, Response } from 'express';
// import { login } from './login';
import { registerUser } from './register';
import { login } from './login';
import { userTokenChecker } from '../../../lib/middleware/tokenChecker';
import { authLimiter } from '../../../lib/middleware/rateLimiters';

const authRouter = Router();

authRouter.post('/login', authLimiter, login)
authRouter.post('/register', authLimiter, registerUser)

export default authRouter;