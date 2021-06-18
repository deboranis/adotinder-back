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
		if(user) {
			const validation = await verify(body.senha, user.senha);
			if (validation) {
				const token = authenticate(user._id);
				return {
					token,
					nome: user.nome,
					email: user.email,
					tipo: user.tipo,
				};

				//RESOLVER PAU DO LOGIN AUTENTICANDO
			}
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
		const newToken = authenticate(user._id);
		return {
			token: newToken,
			data: {
				email: user.email,
				tipo: user.tipo,
				nome: user.nome,
			}
		};
	} catch (error) {
		throw new AppError(error);
	}
};

export const getUser = async (id) => {
	try {
		const user = await User.findById(id, ['email', 'nome', 'telefone', 'cpf', 'cnpj', 'nomeOng']);
		return user;
	} catch (error) {
		throw new AppError(error);
	}
};

export const editUser = async (id, body) => {
	try {
		const editedUser = await User.findByIdAndUpdate(id, body, { new: true, useFindAndModify: false }); //new: true retorna pós atualização
		return editedUser;
	} catch (error) {
		const keyValue = Object.keys(error.keyValue);
		AppError({
			message: keyValue.length > 0 ? `${keyValue} already exists` : 'Não deu pra editar agora, foi mal :(',
			type: keyValue.length > 0 ? `User-Edit-${keyValue}` : 'User-Edit',
			status: keyValue.length > 0 ? 400 : 500,
		});
	}
};

export const deleteUser = async (id) => {
	try {
		await User.findByIdAndDelete(id);
	} catch (error) {
		throw new AppError({
			message: 'Could not delete user',
			type: 'User-Delete',
			status: 500,
		})
	}
};
