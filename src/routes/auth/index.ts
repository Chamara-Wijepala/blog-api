import express from 'express';
import validators from './validators';
import checkValidationErrors from '../../middleware/checkValidationErrors';
import authController from '../../controllers/authController';

const router = express.Router();

router.post(
	'/register',
	validators.validateRegistration,
	checkValidationErrors,
	authController.createUser
);

router.post(
	'/login',
	validators.validateLogin,
	checkValidationErrors,
	authController.authenticateUser
);

export default router;
