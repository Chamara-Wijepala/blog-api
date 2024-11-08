import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
	res.json({ msg: 'Hello, World!' });
});

app.listen(PORT, () => {
	try {
		console.log(`Server running on port: ${PORT}`);
	} catch (error) {
		console.error('Failed to start server:', error);
	}
});
