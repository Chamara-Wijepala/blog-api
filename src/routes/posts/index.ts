import express from 'express';
import passport from 'passport';
import validators from './validators';
import checkValidationErrors from '../../middleware/checkValidationErrors';
import postsController from '../../controllers/postsController';

const router = express.Router();

router.get('/', postsController.getPublishedPosts);

router.get('/:postId', postsController.getPost);

// Require user to be authenticated after this point
router.use(passport.authenticate('jwt', { session: false }));

router.post(
	'/',
	validators.validatePost,
	checkValidationErrors,
	postsController.createPost
);

router.patch(
	'/:postId',
	validators.validatePost,
	checkValidationErrors,
	postsController.updatePost
);

router.delete('/:postId', postsController.deletePost);

export default router;
