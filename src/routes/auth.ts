import express from 'express';
import validateRegistration from '../utils/validators/validateRegistration';
import validateLogin from '../utils/validators/validateLogin';
import checkValidationErrors from '../middleware/checkValidationErrors';
import authController from '../controllers/authController';

const router = express.Router();

router.post(
	'/register',
	validateRegistration,
	checkValidationErrors,
	authController.createUser
);

router.post(
	'/login',
	validateLogin,
	checkValidationErrors,
	authController.authenticateUser
);

export default router;
