import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import mongoConnect from './configs/db.config';
import apiRoutes from './routes/api.routes';
import handle404 from './middlewares/errorHandler';

dotenv.config();

const app = express();
// configs de middlewares
app.use(helmet()); // helmet protege os headers
app.use(morgan('tiny')); // preset do log das rotas. morgan faz o log das rotas
app.use(express.urlencoded({ extended: true }));

// Configuramos o middleware que parseia os requests em json
// para receber requests de até 7mb e somente dos tipos listados
app.use(express.json({
	limit: '7mb',
	type: [
		'application/json',
		'multipart/form-data',
		'application/x-www-form-urlencoded',
	],
}));
app.use(cors({ origin: process.env.FRONT_END_URL, credentials: true }));
// só vai permitir requisições do meu front end e vai permitir cookies
app.use(cookieParser(process.env.COOKIE_SECRET));
// segredo para poder acessar os cookies

app.use('/api', apiRoutes);

app.use(handle404);

mongoConnect(process.env.MONGODB_URI);
app.listen(process.env.PORT, () => console.log(`App running on PORT ${process.env.PORT}`));
