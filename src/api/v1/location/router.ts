import { Router, Request, Response } from 'express';
import { createLocation } from './createLocation';
import { listAllLocations } from './listAllLocations';
import { listAllLocationsOverview } from './listAllLocationsOverview';
import { authorizeRoles } from '../../../lib/middleware/authorizeRoles';
import { UserRoleEnum } from '../../../lib/enums/UserRoleEnum';

const locationRouter = Router();

locationRouter.post('/create', createLocation)
locationRouter.get('/all', listAllLocations)
locationRouter.get('/overview', authorizeRoles([UserRoleEnum.USER]), listAllLocationsOverview)

export default locationRouter;