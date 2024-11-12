import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../db/client';
import issueJWT from '../utils/issueJWT';

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

		const { token, expiresIn } = issueJWT(newUser.id);

		return res.status(200).json({ user: newUser, token, expiresIn });
	});
};

const authenticateUser = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const user = await prisma.user.findUniqueOrThrow({
			where: {
				username: req.body.username,
			},
		});

		bcrypt.compare(req.body.password, user.password, (err, result) => {
			if (err) return next(err);

			if (!result) {
				return res.status(401).json({ msg: 'Incorrect password!' });
			}

			const { token, expiresIn } = issueJWT(user.id);
			const userToReturn = {
				id: user.id,
				username: user.username,
				role: user.role,
			};

			return res.status(200).json({ user: userToReturn, token, expiresIn });
		});
	} catch (err) {
		return next(err);
	}
};

export default {
	createUser,
	authenticateUser,
};
