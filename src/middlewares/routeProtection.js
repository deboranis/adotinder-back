/* eslint-disable consistent-return */
import AppError from '../errors/AppError';
import { validate } from '../utils/authManager';

const routeProtection = (request, response, next) => {
	try {
		const { token } = request.signedCookies;
		if (!token) {
			throw new AppError({
				message: 'No token provided',
				type: 'Auth-no-token',
				status: 401,
			});
		}
		const decoded = validate(token);
		request.user = { id: decoded.id };
		return next();
	} catch (error) {
		response.clearCookie('token')
			.status(error.status)
			.json(new AppError(error));
	}
};

export default routeProtection;
