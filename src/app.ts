import express from 'express';
import routes from './routes';
import errorHandler from './middleware/errorHandler';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/auth', routes.auth);

app.use(errorHandler);

app.listen(PORT, () => {
	try {
		console.log(`Server running on port: ${PORT}`);
	} catch (error) {
		console.error('Failed to start server:', error);
	}
});
