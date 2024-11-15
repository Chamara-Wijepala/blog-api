import express from 'express';
import passport from 'passport';
import validators from './validators';
import checkValidationErrors from '../../middleware/checkValidationErrors';
import postsController from '../../controllers/postsController';

const router = express.Router();

router.get('/', postsController.getPublishedPosts);

router.get('/:postId', postsController.getPost);

router.post(
	'/',
	passport.authenticate('jwt', { session: false }),
	validators.validatePost,
	checkValidationErrors,
	postsController.createPost
);

router.patch(
	'/:postId',
	passport.authenticate('jwt', { session: false }),
	validators.validatePost,
	checkValidationErrors,
	postsController.updatePost
);

router.delete(
	'/:postId',
	passport.authenticate('jwt', { session: false }),
	postsController.deletePost
);

export default router;
