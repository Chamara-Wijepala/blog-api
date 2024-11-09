import express from 'express';
import validateRegistration from '../validators/validateRegistration';
import checkValidationErrors from '../middleware/checkValidationErrors';
import authController from '../controllers/authController';

const router = express.Router();

router.post(
	'/register',
	validateRegistration,
	checkValidationErrors,
	authController.createUser
);

export default router;
