import { Router } from 'express';
import routeProtection from '../middlewares/routeProtection';
import userRoutes from './user.routes';
import authRoutes from './auth.routes';
import petsRoutes from './pets.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use(routeProtection);
router.use('/pets', petsRoutes);
router.use('/user', userRoutes);

export default router;
