import Joi from 'joi';
import { model, Schema } from 'mongoose';

const userSchema = new Schema({
	nome: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	senha: { type: String, required: true },
	cpf: {
		type: String,
		unique: true,
		required: true,
		min: 11,
		max: 11,
	},
	telefone: {
		type: String,
		required: true,
		min: 10,
		max: 11,
		unique: true,
	},
	tipo: { type: String, required: true, enum: ['protetor', 'adotante'] },
	nomeOng: { type: String },
	cnpj: { type: String },
});

const userSchemaValidation = {
	nome: Joi.string().required(),
	email: Joi.string().email().required(),
	senha: Joi.string().required(),
	cpf: Joi.string().required().min(11).max(11),
	telefone: Joi.string().required().min(10).max(11),
	tipo: Joi.string().required().valid('protetor', 'adotante'),
	nomeOng: Joi.string().when('tipo', { is: 'protetor', then: Joi.required() }),
	cnpj: Joi.string().min(14).max(14).when('tipo', { is: 'protetor', then: Joi.required() }),
};

export const loginSchema = Joi
	.object({
		email: userSchemaValidation.email,
		senha: userSchemaValidation.senha,
	}).options({
		abortEarly: false,
	});

export const signUpSchema = Joi
	.object(userSchemaValidation)
	.options({
		abortEarly: false,
	});

export const User = model('User', userSchema);
