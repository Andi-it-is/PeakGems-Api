import { Router, Request, Response } from 'express';
import { createLocation } from './createLocation';
import { listAllLocations } from './listAllLocations';
import { listAllLocationsOverview } from './listAllLocationsOverview';

const locationRouter = Router();

locationRouter.post('/create', createLocation)
locationRouter.get('/all', listAllLocations)
locationRouter.get('/overview', listAllLocationsOverview)

export default locationRouter;