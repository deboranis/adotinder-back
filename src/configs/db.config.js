import { connect } from 'mongoose';

export default function mongoConnect(url) {
	connect(url, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
		useFindAndModify: false,
	})
		.then(() => console.log('Database connected'))
		.catch((error) => {
			console.log(error);
		});
}
