import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../db/client';

const createUser = async (req: Request, res: Response, next: NextFunction) => {
	const { username, password } = req.body;

	bcrypt.hash(password, 10, async (err, hash) => {
		if (err) return next(err);

		const newUser = await prisma.user.create({
			data: {
				username,
				password: hash,
			},
			select: {
				id: true,
				username: true,
				role: true,
			},
		});

		return res.json({ newUser });
	});
};

export default {
	createUser,
};
