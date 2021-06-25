import { hash, compare } from 'bcrypt';
import jwt from 'jsonwebtoken';
import AppError from '../errors/AppError';

/**
 * @param {string} password a senha do usuário
 * @returns {string} um hash da senha
 */
export const encrypt = async (password) => {
	const pwd = await hash(password, 10);
	return pwd;
};

/**
 * @param {string} password a senha do usuário
 * @param {string} hashed o hash do usuário registrado na Db
 * @returns {boolean} um booleano representando sucesso ou fracasso
 */
export const verify = async (password, hashed) => {
	try {
		const validated = await compare(password, hashed);
		return validated;
	} catch (error) {
		return false;
	}
};

/**
 * @param {string} id O ID do usuário na Db
 * @returns {string} um JWT com o ID do usuário criptografado
 */
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

/**
 * @param {string} token Um JWT com o ID do usuário criptografado
 * @returns {object} um objeto que contém o ID do usuário na Db
 */
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