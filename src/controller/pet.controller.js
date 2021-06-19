/* eslint-disable no-underscore-dangle */
import AppError from '../errors/AppError';
import Pet from '../models/Pet';

export const createPet = async (body) => {
  try {
    const createdPet = new Pet(body);
    console.log(createdPet)
    await createdPet.save();
  } catch (error) {
    console.log(error)
    const keyValue = Object.keys(error.keyValue); //Object.keys cria um array com todas as chaves do objeto (mas só as enumeráveis)
    throw new AppError({
			message: `${keyValue}`,
			type: `Pet-Controller-Create-${keyValue}`,
			status: 400,
		});
  }
};

