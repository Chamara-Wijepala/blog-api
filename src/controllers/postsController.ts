import { Request, Response, NextFunction } from 'express';
import prisma from '../db/client';

const createPost = async (req: Request, res: Response, next: NextFunction) => {
	const { title, body, isPublished } = req.body;

	if (!req.user) return next();
	if (req.user.role !== 'AUTHOR') return next();

	try {
		const postId = await prisma.post.create({
			data: {
				title,
				body,
				isPublished,
				authorId: req.user.id,
			},
			select: {
				id: true,
			},
		});

		res.status(200).json({ postId });
	} catch (err) {
		return next(err);
	}
};

const getPublishedPosts = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const posts = await prisma.post.findMany({
			where: {
				isPublished: true,
			},
			select: {
				id: true,
				title: true,
				body: true,
				createdAt: true,
				updatedAt: true,
				author: {
					select: {
						username: true,
					},
				},
			},
		});

		res.status(200).json({ posts });
	} catch (err) {
		return next(err);
	}
};

const getPost = async (req: Request, res: Response, next: NextFunction) => {
	const { postId } = req.params;

	try {
		const post = await prisma.post.findUniqueOrThrow({
			where: {
				id: postId,
				isPublished: true,
			},
			select: {
				id: true,
				title: true,
				body: true,
				createdAt: true,
				updatedAt: true,
				author: {
					select: {
						username: true,
					},
				},
			},
		});

		res.status(200).json({ post });
	} catch (err) {
		return next(err);
	}
};

const updatePost = async (req: Request, res: Response, next: NextFunction) => {
	const { title, body, isPublished } = req.body;
	const { postId } = req.params;

	if (!req.user) return next();
	if (req.user.role !== 'AUTHOR') return next();

	try {
		const post = await prisma.post.findUnique({
			where: {
				id: postId,
			},
		});

		if (!post) throw new Error('Post not found.');
		if (post.authorId !== req.user.id) {
			throw new Error('You do not have permission to update this post.');
		}

		await prisma.post.update({
			where: {
				id: postId,
			},
			data: {
				title,
				body,
				isPublished,
			},
		});

		res.status(200).json({ postId });
	} catch (err) {
		return next(err);
	}
};

const deletePost = async (req: Request, res: Response, next: NextFunction) => {
	const { postId } = req.params;

	if (!req.user) return next();
	if (req.user.role !== 'AUTHOR') return next();

	try {
		const post = await prisma.post.findUnique({
			where: {
				id: postId,
			},
		});

		if (!post) throw new Error('Post not found.');
		if (post.authorId !== req.user.id) {
			throw new Error('You do not have permission to delete this post.');
		}

		await prisma.post.delete({
			where: {
				id: postId,
			},
		});

		res.status(200).json({ msg: 'Post deleted' });
	} catch (err) {
		return next(err);
	}
};

export default {
	createPost,
	getPublishedPosts,
	getPost,
	updatePost,
	deletePost,
};
