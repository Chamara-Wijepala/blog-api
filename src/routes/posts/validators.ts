import { body } from 'express-validator';

const validatePost = [
	body('title')
		.trim()
		.notEmpty()
		.withMessage('The post title is required.')
		.escape(),

	body('body').trim().escape(),

	body('isPublished')
		.isBoolean()
		.withMessage('isPublished is not a boolean value'),
];

export default {
	validatePost,
};
