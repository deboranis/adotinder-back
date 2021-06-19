import { Router } from 'express';
import { getUser, editUser, deleteUser } from '../controller/user.controller';
import AppError from '../errors/AppError';
import { validate } from '../utils/authManager';

const router = Router();

router.get('/edit', async (request, response) => {
  try {
    const { token } = request.signedCookies;
    const id = validate(token);
    const user = await getUser(id.id)
    response.status(200).json(user);
  } catch (error) {
    response.status(error.status).json(new AppError(error));
  }
});

router.post('/edit', async (request, response) => {
  try {
    const { body } = request;
    const { id } = validate(request.signedCookies.token);
    const editedUser = editUser(id, body);
    response.status(200).json(editedUser);
  } catch (error) {
    response.status(error.status).json(new AppError(error));
  }
});

router.delete('/delete', async (request, response) => {
  try {
    const { id } = validate(request.signedCookies.token); //como essa função é síncrona, vai retornar um objeto que por sua vez tem prop id
    await deleteUser(id);
    response.clearCookie('token').status(200).json({ message: 'Usuário removido com sucesso.' });
  } catch (error) {
    response.status(error.status).json(new AppError(error));
  }
});

export default router;

