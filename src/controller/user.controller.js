/* eslint-disable no-underscore-dangle */
import AppError from '../errors/AppError';
import { User } from '../models/User';
import {
	authenticate,
	encrypt,
	verify,
	validate,
} from '../utils/authManager';

// eslint-disable-next-line import/prefer-default-export
export const createUser = async (body) => {
	try {
		const newUser = new User({ ...body, senha: await encrypt(body.senha) });
		await newUser.save();
		return {
			id: newUser._id,
			token: authenticate(newUser._id),
			nome: newUser.nome,
			email: newUser.email,
			tipo: newUser.tipo,
		};
	} catch (error) {
		const keyValue = Object.keys(error.keyValue);
		throw new AppError({
			message: `${keyValue} already exists`,
			type: `User-Repo-Create-${keyValue}`,
			status: 400,
		});
	}
};

export const login = async (body) => {
	try {
		const user = await User.findOne({ email: body.email }, ['nome', 'email', 'tipo', '_id', 'senha']);
		const validation = await verify(body.senha, user.senha);
		if (validation) {
			const token = authenticate(user._id);
			return {
				token,
				nome: user.nome,
				email: user.email,
				tipo: user.tipo,
			};
		}
		throw new AppError({
			message: 'Email ou senha incorretos',
			type: 'No-Credentials',
			status: 401,
		});
	} catch (error) { return error; }
};

export const verifyToken = async (token) => {
	try {
		const validatedToken = validate(token);
		const user = await User.findById(validatedToken.id, ['email', 'nome', '_id', 'tipo']);
		const token = authenticate(user._id);
		return {
			token,
			email: user.email,
			tipo: user.tipo,
			nome: user.nome,
		};
	} catch (error) {
		throw new AppError(error);
	}
};
