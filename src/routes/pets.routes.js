import { Router } from 'express';
import { createPet } from '../controller/pet.controller';
import AppError from '../errors/AppError';

const router = Router();

router.post('/criar', async (request, response) => {
  try {
    await createPet(request.body);
    response.status(200).json({ message: 'Pet criado com sucesso!' });
  } catch (error) {
    response.status(400).json(new AppError(error));
  }
});

export default router;
