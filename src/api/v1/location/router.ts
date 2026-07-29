import { Router, Request, Response } from 'express';
import { createLocation } from './createLocation';
import { listAllLocations } from './listAllLocations';
import { listAllLocationsOverview } from './listAllLocationsOverview';
import { authorizeRoles } from '../../../lib/middleware/authorizeRoles';
import { UserRoleEnum } from '../../../lib/enums/UserRoleEnum';
import { updateLocation } from './updateLocation';
import { deleteLocation } from './deleteLocation';
import { uploadLocationImages } from './uploadLocationImages';
import { listLocationImages } from './listLocationImages';
import { listAllLocationImages } from './listAllLocationImages';
import { deleteLocationImage } from './deleteLocationImage';
import { upload } from '../../../lib/upload';

const locationRouter = Router();

locationRouter.post('/create', authorizeRoles([UserRoleEnum.USER, UserRoleEnum.ADMIN]), createLocation)
locationRouter.get('/all', authorizeRoles([UserRoleEnum.USER, UserRoleEnum.ADMIN]), listAllLocations)
locationRouter.get('/overview', authorizeRoles([UserRoleEnum.USER, UserRoleEnum.ADMIN]), listAllLocationsOverview)

locationRouter.put('/:id', authorizeRoles([UserRoleEnum.USER, UserRoleEnum.ADMIN]), updateLocation)
locationRouter.delete('/:id', authorizeRoles([UserRoleEnum.ADMIN]), deleteLocation)


// images related
locationRouter.get("/images/all", authorizeRoles([UserRoleEnum.USER, UserRoleEnum.ADMIN]), listAllLocationImages);
locationRouter.get("/:id/images", authorizeRoles([UserRoleEnum.USER, UserRoleEnum.ADMIN]), listLocationImages);
locationRouter.post(
  "/:id/images",
  authorizeRoles([UserRoleEnum.USER, UserRoleEnum.ADMIN]),
  upload.array("images", 10), // <- diese Zeile muss vor dem Controller stehen
  uploadLocationImages
);
locationRouter.delete("/images/:imageId", authorizeRoles([UserRoleEnum.USER, UserRoleEnum.ADMIN]), deleteLocationImage);

export default locationRouter;