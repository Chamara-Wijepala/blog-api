import { body } from 'express-validator';
import prisma from '../../db/client';

const validateLogin = [
	body('username')
		.trim()
		.notEmpty()
		.withMessage('Username is required.')
		.escape(),

	body('password').trim().notEmpty().withMessage('Password is required.'),
];

const validateRegistration = [
	body('username')
		.trim()
		.notEmpty()
		.withMessage('Username is required.')
		.escape()
		.custom(async (value) => {
			const user = await prisma.user.findUnique({
				where: {
					username: value,
				},
			});

			if (user) {
				throw new Error('This username already exists.');
			}
		}),

	body('password').trim().notEmpty().withMessage('Password is required.'),

	body('confirmPassword')
		.trim()
		.notEmpty()
		.withMessage('Confirm password is required.')
		.custom((value, { req }) => {
			return value === req.body.password;
		})
		.withMessage('Passwords do not match.'),
];

const validateAuthorization = [
	body('username')
		.trim()
		.notEmpty()
		.withMessage('Username is required.')
		.escape(),

	body('passphrase')
		.trim()
		.notEmpty()
		.withMessage('The passphrase is required.')
		.custom((value) => {
			return value === process.env.AUTHORIZATION_PASSPHRASE;
		})
		.withMessage('Incorrect passphrase'),
];

export default {
	validateLogin,
	validateRegistration,
	validateAuthorization,
};
