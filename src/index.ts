import express from 'express';
const app = express();
import { connectDB } from './db/connect';
import { notFound } from './middleware/not-found';
import { errorHandlerMiddleware } from './middleware/error-handler';
import authRoute from './routes/auth';
import notesRoute from './routes/note';
import searchRoute from './routes/search';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
dotenv.config();

const port = process.env.PORT || 3000;

app.use(express.json());

app.use(
	rateLimit({
		windowMs: process.env.RATELIMIT_WINDOW ? Number(process.env.RATELIMIT_WINDOW) * 60 * 1000 : 24 * 60 * 60 * 1000, // 24 hrs in milliseconds
		max: process.env.RATELIMIT_MAX ? Number(process.env.RATELIMIT_MAX) : 100,
		message: 'You have exceeded the 100 requests in 24 hrs limit!',
		standardHeaders: true,
		legacyHeaders: false,
	})
);

app.use(helmet());

app.disable('x-powered-by');

app.use('/api/auth', authRoute);
app.use('/api/notes', notesRoute);
app.use('/api/search', searchRoute);
app.use(notFound);
app.use(errorHandlerMiddleware);

const start = async () => {
	try {
		await connectDB(process.env.MONGO_URI);
		app.listen(port, () => console.log(`Server listening on port ${port}...`));
	} catch (err) {
		console.log(err);
	}
};

start();
