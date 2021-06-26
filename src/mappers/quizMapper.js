/**
 * @param {object} queries Um objeto contendo todas as queries do quiz
 * @returns Um objeto com as queries formatadas para filtragem na Db
 */
export default function quizMapper(queries) {
	const {
		especie,
		idade,
		criancas,
		animais,
		fiv,
		felv,
	} = queries;
	const filter = {
		especie: especie === 'true',
		idade: idade === 'false' ? { $gte: 12 } : null,
		socializaCriancas: criancas === 'true' ? true : criancas === 'false' ? false : null,
		socializaAnimais: animais === 'true' ? true : animais === 'false' ? false : null,
		fiv: fiv === 'true' ? true : fiv === 'false' ? false : null,
		felv: felv === 'true' ? true : felv === 'false' ? false : null,
	};
	if (!filter.idade) {
		delete filter.idade;
	}
	if (filter.fiv === null && filter.felv === null) {
		delete filter.fiv;
		delete filter.felv;
	}
	if (filter.socializaAnimais === null) { delete filter.socializaAnimais; }
	if (filter.socializaCriancas === null) { delete filter.socializaCriancas; }
	return filter;
}
