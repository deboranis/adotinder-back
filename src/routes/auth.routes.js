import { Router } from 'express';
import { validateSignUp, validateLogin } from '../middlewares/authValidation';
import { authBadResponse } from '../utils/authManager';
import routeProtection from '../middlewares/routeProtection';
import { createUser, login, verifyToken } from '../controller/user.controller';

const router = Router();

router.post('/signup', validateSignUp, async (request, response) => {
	try {
		const { body } = request;
		console.log(body)
		await createUser(body);
		response.status(201).json({ message: 'Registered successfully' });
	} catch (error) {
		response.status(401).json(error);
	}
});

router.post('/login', validateLogin, async (request, response) => {
	try {
		const { body } = request;
		const data = await login(body);
		response.cookie('token', data.token, {
			expire: process.env.COOKIE_EXPIRY + Date.now(),
			httpOnly: true,
			signed: true,
			sameSite: 'strict',
			secure: true,
		}).status(200).json({ usuário: data.nome, email: data.email });
	} catch (error) {
		response.status(401).json(error);
	}
});

router.use(routeProtection);

// serve pra revalidar a sessão de usuário, revalidando o token, que por sua vez está no cookie
// estamos empacotando o jsonwebtoken em um cookie pra evitar cross site scripting

router.get('/token', async (request, response) => {
	try {
		const { token } = request.signedCookies;
		const user = await verifyToken(token);
		response.cookie('token', user.token, {
			maxAge: 604800000,
			httpOnly: true,
			signed: true,
			sameSite: 'strict',
			secure: true,
		}).status(200).json(user.data);
	} catch (error) {
		console.log(error)
		response.clearCookie('token').status(error.status).json(error);
	}
});

router.get('/logout', (request, response) => {
	response.clearCookie('token').status(200).json({ message: 'User logged out' });
});

export default router;
