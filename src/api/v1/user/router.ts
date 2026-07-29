import { Router, Request, Response } from 'express';
import { getAllUsers } from './getAllUsers';
import { getAllUsersLimited } from './getAllUsersLimited';
import { getLeaderboard } from './getLeaderboard';
import { authorizeRoles } from '../../../lib/middleware/authorizeRoles';
import { UserRoleEnum } from '../../../lib/enums/UserRoleEnum';
import { getUserInfo } from './getUserInfo';
import { resetUserPassword } from './resetPassword';
import { uploadAvatar } from './uploadAvatar';
import { removeAvatar } from './removeAvatar';
import { avatarUpload, AVATAR_UPLOAD_DIR } from '../../../lib/upload';
import { updateUser } from './updateUser';
import { setNewPasswordAfterReset } from './setNewPasswordAfterReset';
import { serveUploadedFile } from '../../../lib/middleware/serveUploadedFile';

const userRouter = Router();

userRouter.get('/all', authorizeRoles([UserRoleEnum.ADMIN]), getAllUsers)
userRouter.get('/all/limited', authorizeRoles([UserRoleEnum.USER, UserRoleEnum.ADMIN]), getAllUsersLimited)
userRouter.get('/leaderboard', authorizeRoles([UserRoleEnum.USER, UserRoleEnum.ADMIN]), getLeaderboard)
userRouter.get('/me', authorizeRoles([UserRoleEnum.USER, UserRoleEnum.ADMIN]), getUserInfo)
userRouter.post('/resetPassword/:id', authorizeRoles([UserRoleEnum.USER, UserRoleEnum.ADMIN]), resetUserPassword)
userRouter.post('/setNewPasswordAfterReset', authorizeRoles([UserRoleEnum.USER, UserRoleEnum.ADMIN]), setNewPasswordAfterReset)

// avatar related
userRouter.post(
  '/avatar',
  authorizeRoles([UserRoleEnum.USER, UserRoleEnum.ADMIN]),
  avatarUpload.single("avatar"), // <- diese Zeile muss vor dem Controller stehen
  uploadAvatar
)
userRouter.delete('/avatar', authorizeRoles([UserRoleEnum.USER, UserRoleEnum.ADMIN]), removeAvatar)
userRouter.get('/avatar/:filename', authorizeRoles([UserRoleEnum.USER, UserRoleEnum.ADMIN]), serveUploadedFile(AVATAR_UPLOAD_DIR))

userRouter.patch('/:id', authorizeRoles([UserRoleEnum.ADMIN]), updateUser)

export default userRouter;