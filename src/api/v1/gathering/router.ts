import { Router } from 'express';
import { authorizeRoles } from '../../../lib/middleware/authorizeRoles';
import { UserRoleEnum } from '../../../lib/enums/UserRoleEnum';
import { createGathering } from './createGathering';
import { listAllGatherings } from './listAllGatherings';
import { updateGathering } from './updateGathering';
import { deleteGathering } from './deleteGathering';
import { setAttendance } from './setAttendance';

const gatheringRouter = Router();

gatheringRouter.post('/create', authorizeRoles([UserRoleEnum.USER, UserRoleEnum.ADMIN]), createGathering)
gatheringRouter.get('/all', authorizeRoles([UserRoleEnum.USER, UserRoleEnum.ADMIN]), listAllGatherings)
gatheringRouter.put('/:id', authorizeRoles([UserRoleEnum.USER, UserRoleEnum.ADMIN]), updateGathering)
gatheringRouter.delete('/:id', authorizeRoles([UserRoleEnum.USER, UserRoleEnum.ADMIN]), deleteGathering)

gatheringRouter.post('/:id/attendance', authorizeRoles([UserRoleEnum.USER, UserRoleEnum.ADMIN]), setAttendance)

export default gatheringRouter;
