import { Router } from 'express';
import AppError from '../errors/AppError';
import { createAdoption, getAdotanteAdoptions, getProtetorAdoptions } from '../controller/adoption.controller';

const router = Router();

router.post('/criar', async (request, response) => {
	try {
		await createAdoption({ ...request.body });
		response.status(200).json({ message: 'Adoção criada com sucesso!', status: request.body.status });
	} catch (error) {
		response.status(500).json(new AppError(error));
	}
});

router.get('/lista/adotante', async (request, response) => {
	try {
		const adoptions = await getAdotanteAdoptions(request.user.id);
		response.status(200).json(adoptions);
	} catch (error) {
		response.status(500).json(new AppError(error));
	}
});

router.get('/lista/protetor', async (request, response) => {
	try {
		const adoptions = await getProtetorAdoptions(request.user.id);
		response.status(200).json(adoptions);
	} catch (error) {
		response.status(500).json(new AppError(error));
	}
});

export default router;
