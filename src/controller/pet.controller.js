/* eslint-disable no-underscore-dangle */
import AppError from '../errors/AppError';
import quizMapper from '../mappers/quizMapper';
import Pet from '../models/Pet';

/**
 * @param {object} body O objeto com os dados do pet a ser adicionado
 * Essa função apenas salva os dados na Db e não retorna dados
 */
export const createPet = async (body) => {
	try {
		const createdPet = new Pet(body);
		await createdPet.save();
	} catch (error) {
		const keyValue = Object.keys(error.keyValue); // Object.keys cria um array com todas as chaves do objeto (mas só as enumeráveis)
		throw new AppError({
			message: `${keyValue}`,
			type: `Pet-Controller-Create-${keyValue}`,
			status: 400,
		});
	}
};

/**
 * @param {string} user Uma string contendo o ID de usuário na Db
 * @returns {object[]} Um array com os pets registrador pelo protetor
 */
export const getUserPets = async (user) => {
	try {
		const pets = await Pet.find({ protetor: user });
		return pets;
	} catch (error) {
		throw new AppError({
			message: 'Não foi possível buscar os pets. Tente novamente mais tarde',
			type: 'Pet-User-Find',
			status: 500,
		});
	}
};

export const getQuizPets = async (queries) => {
	try {
		const quizResult = await Pet.find(quizMapper(queries));
		return quizResult;
	} catch (error) {
		throw new AppError({
			message: 'Não foi possível concluir o quiz agora. Tente novamente mais tarde',
			type: 'Pet-Quiz-Result',
			status: 500,
		});
	}
};
