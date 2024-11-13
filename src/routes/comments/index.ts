import express from 'express';
import passport from 'passport';
import validators from './validators';
import checkValidationErrors from '../../middleware/checkValidationErrors';
import commentsController from '../../controllers/commentsController';

const router = express.Router({ mergeParams: true });

router.get('/', commentsController.getComments);

router.post(
	'/',
	passport.authenticate('jwt', { session: false }),
	validators.validateComment,
	checkValidationErrors,
	commentsController.createComment
);

router.patch(
	'/:commentId',
	passport.authenticate('jwt', { session: false }),
	validators.validateComment,
	checkValidationErrors,
	commentsController.updateComment
);

router.delete(
	'/:commentId',
	passport.authenticate('jwt', { session: false }),
	commentsController.deleteComment
);

export default router;
