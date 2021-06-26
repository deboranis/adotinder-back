import AppError from '../errors/AppError';
import Adoption from '../models/Adoption';

export const createAdoption = async (body) => {
	try {
		const adoption = new Adoption(body);
		await adoption.save();
	} catch (error) {
		throw new AppError({
			message: 'Não foi possível criar a adoção. Tente novamente mais tarde.',
			type: 'Adoption-Create',
			status: 500,
		});
	}
};

export const getProtetorAdoptions = async (id) => {
	try {
		const adoptions = await Adoption.find({ protetor: id }, { _id: 0 })
			.populate({
				path: 'adotante',
				select: {
					nome: 1,
					email: 1,
					telefone: 1,
					_id: 0,
				},
			})
			.populate('pet');
		return adoptions;
	} catch (error) {
		throw new AppError({
			message: 'Não foi possível obter as adoções. Por favor tente novamente mais tarde',
			type: 'Adoption-Get-Protetor',
			status: 500,
		});
	}
};

export const getAdotanteAdoptions = async (id) => {
	try {
		const adoptions = await Adoption.find({ adotante: id }, { _id: 0 })
			.populate({
				path: 'protetor',
				select: {
					nome: 1,
					telefone: 1,
					email: 1,
					_id: 0,
				},
			})
			.populate('pet');
		return adoptions;
	} catch (error) {
		throw new AppError({
			message: 'Não foi possível obter as adoções. Por favor tente novamente mais tarde',
			type: 'Adoption-Get-Adotante',
			status: 500,
		});
	}
};
