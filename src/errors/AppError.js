export default class AppError extends Error {
	constructor(params = {}) {
		super();
		this.message = params.message || 'Rolou um erro, tente novamente depois. Foi mal.';
		this.type = params.type || 'Erro de servidor';
		this.status = params.status || 500;
	}
}
