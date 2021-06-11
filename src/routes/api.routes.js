import { Router } from 'express';
import routeProtection from '../middlewares/routeProtection';
import authRoutes from './auth.routes';
import petsRoutes from './pets.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use(routeProtection);
router.use('/pets', petsRoutes);

export default router;
