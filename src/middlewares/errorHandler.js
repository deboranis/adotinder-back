export default function handle404(request, response) {
	response.status(404).json({
		name: 'Page404',
		url: request.url,
		message: 'O Adotinder não encontrou este serviço :(',
		status: 404,
	});
}
