import { Router, Request, Response } from 'express';
import { getAllUsers } from './getAllUsers';
import { authorizeRoles } from '../../../lib/middleware/authorizeRoles';
import { UserRoleEnum } from '../../../lib/enums/UserRoleEnum';
import { getUserInfo } from './getUserInfo';
import { resetUserPassword } from './resetPassword';

const userRouter = Router();

userRouter.get('/all', authorizeRoles([UserRoleEnum.ADMIN]), getAllUsers )
userRouter.get('/me', authorizeRoles([UserRoleEnum.USER, UserRoleEnum.ADMIN]) , getUserInfo )
userRouter.post('/resetPassword/:id', authorizeRoles([UserRoleEnum.USER, UserRoleEnum.ADMIN]) , resetUserPassword)

export default userRouter;