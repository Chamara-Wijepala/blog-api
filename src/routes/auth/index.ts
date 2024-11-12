import express from 'express';
import passport from 'passport';
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

router.post(
	'/role/:roleName',
	passport.authenticate('jwt', { session: false }),
	validators.validateAuthorization,
	checkValidationErrors,
	authController.authorizeUserByRoleName
);

export default router;
