import { Router, Request, Response } from 'express';
import { getReviewsByLocationId } from './getReviewsByLocationId';
import { authorizeRoles } from '../../../lib/middleware/authorizeRoles';
import { UserRoleEnum } from '../../../lib/enums/UserRoleEnum';
import { createReview } from './createReview';

const reviewRouter = Router();

// reviewRouter.post('/create', authorizeRoles([UserRoleEnum.USER]), createReview)

reviewRouter.post('/create', createReview)
reviewRouter.get('/:id', getReviewsByLocationId)

export default reviewRouter;