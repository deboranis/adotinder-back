/* eslint-disable no-underscore-dangle */
import AppError from '../errors/AppError';
import { User } from '../models/User';
import {
	authenticate,
	encrypt,
	verify,
	validate,
} from '../utils/authManager';

/**
 * @param {object} body Um objeto contendo os dados do usuário a ser criado.
 * Essa função não retorna dados, apenas salva o usuário na Db.
 */
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

/**
 * @param {object} body Um objeto contendo o email e senha do usuário que deseja se autenticar
 * @returns Um objeto contendo o JWT e os dados de usuário a serem enviados para o front
 */
export const login = async (body) => {
	try {
		const user = await User.findOne({ email: body.email }, ['nome', 'email', 'tipo', '_id', 'senha']);
		if (user) {
			const validation = await verify(body.senha, user.senha);
			if (validation) {
				const token = authenticate(user._id);
				return {
					token,
					nome: user.nome,
					email: user.email,
					tipo: user.tipo,
					id: user._id,
				};
			}
		}
		throw new AppError({
			message: 'Email ou senha incorretos',
			type: 'No-Credentials',
			status: 401,
		});
	} catch (error) { throw new AppError(error); }
};

/**
 * @param {string} token O JWT enviado pelo usuário para renovação da sessão
 * @returns Um novo JWT com os dados do usuário a serem enviados para o front
 */
export const verifyToken = async (token) => {
	try {
		const validatedToken = validate(token);
		const user = await User.findById(validatedToken.id, {
			email: 1,
			nome: 1,
			_id: 1,
			tipo: 1,
		});
		const newToken = authenticate(user._id);
		return {
			token: newToken,
			data: {
				email: user.email,
				tipo: user.tipo,
				nome: user.nome,
				id: user._id,
			},
		};
	} catch (error) {
		throw new AppError(error);
	}
};

/**
 * @param {string} id O ID do usuário na Db
 * @returns {object} Um objeto contendo os dados do usuário
 */
export const getUser = async (id) => {
	try {
		const user = await User.findById(id, ['email', 'nome', 'telefone', 'cpf', 'cnpj', 'nomeOng', 'tipo']);
		return user;
	} catch (error) {
		throw new AppError(error);
	}
};

/**
 * @param {string} id O ID do usuário na Db
 * @param {object} body Um objeto contendo os dados a serem atualizados
 * @returns {object} Os dados atualizados do usuário
 */
export const editUser = async (id, body) => {
	try {
		const editedUser = await User.findByIdAndUpdate(id, body, { new: true, useFindAndModify: false }); // new: true retorna pós atualização
		return editedUser;
	} catch (error) {
		const keyValue = Object.keys(error.keyValue);
		throw new AppError({
			message: keyValue.length > 0 ? `${keyValue} already exists` : 'Não deu pra editar agora, foi mal :(',
			type: keyValue.length > 0 ? `User-Edit-${keyValue}` : 'User-Edit',
			status: keyValue.length > 0 ? 400 : 500,
		});
	}
};

/**
 * @param {string} id O ID do usuário na Db.
 * Essa função apenas deleta o usuário da Db e não retorna dados
 */
export const deleteUser = async (id) => {
	try {
		await User.findByIdAndDelete(id);
	} catch (error) {
		throw new AppError({
			message: 'Could not delete user',
			type: 'User-Delete',
			status: 500,
		});
	}
};
