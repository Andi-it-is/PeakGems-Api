import { Router } from 'express';
import { authorizeRoles } from '../../../lib/middleware/authorizeRoles';
import { UserRoleEnum } from '../../../lib/enums/UserRoleEnum';
import { listAllBadges } from './listAllBadges';
import { createBadge } from './createBadge';
import { deleteBadge } from './deleteBadge';
import { updateBadge } from './updateBadge';
import { giveBadge } from './giveBadge';
import { removeBadge } from './removeBadge';

const badgeRouter = Router();

badgeRouter.get('/all', authorizeRoles([UserRoleEnum.USER, UserRoleEnum.ADMIN]), listAllBadges)
badgeRouter.post('/create', authorizeRoles([UserRoleEnum.USER, UserRoleEnum.ADMIN]), createBadge)
badgeRouter.put('/:id', authorizeRoles([UserRoleEnum.USER, UserRoleEnum.ADMIN]), updateBadge)
badgeRouter.delete('/:id', authorizeRoles([UserRoleEnum.USER, UserRoleEnum.ADMIN]), deleteBadge)

// Vergabe an User
badgeRouter.post('/:id/users', authorizeRoles([UserRoleEnum.USER, UserRoleEnum.ADMIN]), giveBadge)
badgeRouter.delete('/:id/users/:userId', authorizeRoles([UserRoleEnum.USER, UserRoleEnum.ADMIN]), removeBadge)

export default badgeRouter;
