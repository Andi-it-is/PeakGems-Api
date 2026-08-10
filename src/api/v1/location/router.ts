import { Router, Request, Response } from 'express';
import { createLocation } from './createLocation';
import { listAllLocations } from './listAllLocations';
import { listAllLocationsOverview } from './listAllLocationsOverview';
import { listAllLocationsWithReviews } from './listAllLocationsWithReviews';
import { authorizeRoles } from '../../../lib/middleware/authorizeRoles';
import { UserRoleEnum } from '../../../lib/enums/UserRoleEnum';
import { updateLocation } from './updateLocation';
import { deleteLocation } from './deleteLocation';
import { uploadLocationImages } from './uploadLocationImages';
import { listLocationImages } from './listLocationImages';
import { listAllLocationImages } from './listAllLocationImages';
import { deleteLocationImage } from './deleteLocationImage';
import { updateLocationImage } from './updateLocationImage';
import { upload, LOCATION_UPLOAD_DIR } from '../../../lib/upload';
import { serveUploadedFile } from '../../../lib/middleware/serveUploadedFile';

const locationRouter = Router();

locationRouter.post('/create', authorizeRoles([UserRoleEnum.USER, UserRoleEnum.ADMIN]), createLocation)
locationRouter.get('/all', authorizeRoles([UserRoleEnum.USER, UserRoleEnum.ADMIN]), listAllLocations)
locationRouter.get('/overview', authorizeRoles([UserRoleEnum.USER, UserRoleEnum.ADMIN]), listAllLocationsOverview)
locationRouter.get('/all/with-reviews', authorizeRoles([UserRoleEnum.USER, UserRoleEnum.ADMIN]), listAllLocationsWithReviews)

locationRouter.put('/:id', authorizeRoles([UserRoleEnum.USER, UserRoleEnum.ADMIN]), updateLocation)
locationRouter.delete('/:id', authorizeRoles([UserRoleEnum.ADMIN]), deleteLocation)


// images related
locationRouter.get("/images/all", authorizeRoles([UserRoleEnum.USER, UserRoleEnum.ADMIN]), listAllLocationImages);
locationRouter.get("/images/:filename", authorizeRoles([UserRoleEnum.USER, UserRoleEnum.ADMIN]), serveUploadedFile(LOCATION_UPLOAD_DIR));
locationRouter.get("/:id/images", authorizeRoles([UserRoleEnum.USER, UserRoleEnum.ADMIN]), listLocationImages);
locationRouter.post(
  "/:id/images",
  authorizeRoles([UserRoleEnum.USER, UserRoleEnum.ADMIN]),
  upload.array("images", 25), // <- diese Zeile muss vor dem Controller stehen
  uploadLocationImages
);
locationRouter.patch("/images/:imageId", authorizeRoles([UserRoleEnum.USER, UserRoleEnum.ADMIN]), updateLocationImage);
locationRouter.delete("/images/:imageId", authorizeRoles([UserRoleEnum.USER, UserRoleEnum.ADMIN]), deleteLocationImage);

export default locationRouter;