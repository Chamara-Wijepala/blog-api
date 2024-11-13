import { Request, Response, NextFunction } from 'express';
import prisma from '../db/client';

const createComment = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	if (!req.user) return next();

	try {
		const newComment = await prisma.comment.create({
			data: {
				body: req.body.body,
				authorId: req.user.id,
				postId: req.params.postId,
			},
			select: {
				id: true,
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

		res.status(200).json({ newComment });
	} catch (err) {
		return next(err);
	}
};

const getComments = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const comments = await prisma.comment.findMany({
			where: {
				postId: req.params.postId,
			},
			select: {
				id: true,
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

		res.status(200).json({ comments });
	} catch (err) {
		next(err);
	}
};

const updateComment = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { commentId } = req.params;

	if (!req.user) return next();
	if (req.user.role !== 'AUTHOR') return next();

	try {
		const comment = await prisma.comment.findUnique({
			where: {
				id: commentId,
			},
		});

		if (!comment) throw new Error('Comment not found');
		if (comment.authorId !== req.user.id) {
			throw new Error('You do not have permission to update this comment');
		}

		const updatedComment = await prisma.comment.update({
			where: {
				id: commentId,
			},
			data: {
				body: req.body.body,
			},
			select: {
				id: true,
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

		res.status(200).json({ updatedComment });
	} catch (err) {
		next(err);
	}
};

const deleteComment = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { commentId } = req.params;

	if (!req.user) return next();

	try {
		const comment = await prisma.comment.findUnique({
			where: {
				id: commentId,
			},
		});

		if (!comment) throw new Error('Comment not found');
		if (comment.authorId !== req.user.id) {
			throw new Error('You do not have permission to delete this comment');
		}

		await prisma.comment.delete({
			where: {
				id: commentId,
			},
		});

		res.sendStatus(204);
	} catch (err) {
		return next(err);
	}
};

export default {
	createComment,
	getComments,
	updateComment,
	deleteComment,
};
