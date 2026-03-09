import { Router, Request, Response } from 'express';
import { createLocation } from './createLocation';
import { listAllLocations } from './listAllLocations';
import { listAllLocationsOverview } from './listAllLocationsOverview';
import { authorizeRoles } from '../../../lib/middleware/authorizeRoles';
import { UserRoleEnum } from '../../../lib/enums/UserRoleEnum';

const locationRouter = Router();

locationRouter.post('/create', authorizeRoles([UserRoleEnum.USER, UserRoleEnum.ADMIN]), createLocation)
locationRouter.get('/all', authorizeRoles([UserRoleEnum.USER, UserRoleEnum.ADMIN]), listAllLocations)
locationRouter.get('/overview', authorizeRoles([UserRoleEnum.USER, UserRoleEnum.ADMIN]), listAllLocationsOverview)

export default locationRouter;