import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import passport from 'passport';
import routes from './routes';
import passportStrategy from './config/passport';
import errorHandler from './middleware/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

passport.use(passportStrategy);
app.use(express.json());
app.use(cors());
app.use(passport.initialize());

app.use('/auth', routes.auth);
app.use('/posts', routes.posts);

app.use(errorHandler);

app.listen(PORT, () => {
	try {
		console.log(`Server running on port: ${PORT}`);
	} catch (error) {
		console.error('Failed to start server:', error);
	}
});
