import { Router, Request, Response } from 'express';
import { getReviewsByLocationId } from './getReviewsByLocationId';
import { authorizeRoles } from '../../../lib/middleware/authorizeRoles';
import { UserRoleEnum } from '../../../lib/enums/UserRoleEnum';
import { createReview } from './createReview';
import { getAllReviewsFromUserId } from './getAllReviewsFromUserId';
import { updateReview } from './updateReview';
import { deleteReview } from './deleteReview';

const reviewRouter = Router();

// reviewRouter.post('/create', authorizeRoles([UserRoleEnum.USER]), createReview)

reviewRouter.post('/create', authorizeRoles([UserRoleEnum.USER, UserRoleEnum.ADMIN]), createReview)
reviewRouter.get('/:id', authorizeRoles([UserRoleEnum.USER, UserRoleEnum.ADMIN]), getReviewsByLocationId)
reviewRouter.get('/all/:id', authorizeRoles([UserRoleEnum.USER, UserRoleEnum.ADMIN]), getAllReviewsFromUserId)

reviewRouter.put('/update/:id', authorizeRoles([UserRoleEnum.USER, UserRoleEnum.ADMIN]), updateReview)
reviewRouter.delete('/:id', authorizeRoles([UserRoleEnum.ADMIN]), deleteReview)

export default reviewRouter;