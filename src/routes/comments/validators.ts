import { body } from 'express-validator';

const validateComment = [
	body('body').trim().notEmpty().withMessage('The comment is empty.').escape(),
];

export default {
	validateComment,
};
