import { signUpSchema, loginSchema } from '../models/User';
import AppError from '../errors/AppError';

export const validateSignUp = (request, response, next) => {
	const validation = signUpSchema.validate(request.body);
	if (validation.error) {
		const error = validation.error.details.reduce((acc, err) => {
			acc[err.context.label] = err.message;
			return acc;
		}, {});
		throw new AppError({
			message: error,
			type: 'SignUp-Validate-Error',
			status: 400,
		});
	}
	return next();
};

export const validateLogin = (request, response, next) => {
	const validation = loginSchema.validate(request.body);
	if (validation.error) {
		const error = validation.error.details.reduce((acc, err) => {
			acc[err.context.label] = err.message;
			return acc;
		}, {});
		throw new AppError({
			message: error,
			type: 'Login-Validate-Error',
			status: 401,
		});
	}
	return next();
};
