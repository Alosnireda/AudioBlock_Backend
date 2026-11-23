import { Router } from 'express';
import { TakedownController } from '../controllers/TakedownController';
import { requireAuth, requireRoles } from '../middlewares/authMiddleware';
import { UserRole } from '../entities/User';
import { validateDTO } from '../middlewares/validate';
import {
  CounterNoticeTakedownDTO,
  CreateTakedownRequestDTO,
  ReviewTakedownRequestDTO,
} from '../dtos/TakedownRequestDTO';

const router = Router();

// Any authenticated user can file a takedown request
router.post(
  '/request',
  requireAuth,
  validateDTO(CreateTakedownRequestDTO),
  TakedownController.create,
);

// The artist of the song can dispute an approved takedown (#981). The service
// checks that the caller owns the song and that the window is still open.
router.post(
  '/:id/counter-notice',
  requireAuth,
  validateDTO(CounterNoticeTakedownDTO),
  TakedownController.submitCounterNotice,
);

// Admin-only: list, get, review
router.get('/', requireRoles(UserRole.ADMIN), TakedownController.list);
router.get('/:id', requireRoles(UserRole.ADMIN), TakedownController.getOne);
router.patch(
  '/:id/review',
  requireRoles(UserRole.ADMIN),
  validateDTO(ReviewTakedownRequestDTO),
  TakedownController.review,
);

export default router;
