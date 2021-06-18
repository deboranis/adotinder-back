import { hash, compare } from 'bcrypt';
import jwt from 'jsonwebtoken';
import AppError from '../errors/AppError';

export const encrypt = async (password) => {
	const pwd = await hash(password, 10);
	return pwd;
};

export const verify = async (password, hashed) => {
	try {
		const validated = await compare(password, hashed);
		return validated;
	} catch (error) {
		return false;
	}
};

export const authenticate = (id) => {
	if (id) {
		const token = jwt.sign({id},
			process.env.TOKEN_SECRET,
			{ expiresIn: process.env.TOKEN_EXPIRY });
		return token;
	}

	throw new AppError({
		message: 'No user provided',
		type: 'Auth-No-User',
		status: 400,
	});
};

export const validate = (token) => {
	try {
		const validated = jwt.verify(token, process.env.TOKEN_SECRET);
		return validated;
	} catch (error) {
		throw new AppError({
			message: 'Expired or invalid token',
			type: 'Auth-Invalid-Token',
			status: 401,
		});
	}
};

export const authBadResponse = (res, error) => {
	res.status(400).json(error);
};
