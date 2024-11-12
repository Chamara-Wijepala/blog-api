import fs from 'fs';
import path from 'path';
import {
	Strategy as JwtStrategy,
	ExtractJwt,
	StrategyOptions,
} from 'passport-jwt';
import { TokenExpiredError } from 'jsonwebtoken';
import prisma from '../db/client';

const pathToKey = path.join(__dirname, '..', '..', 'keys/id_rsa_pub.pem');
const PUB_KEY = fs.readFileSync(pathToKey, 'utf-8');

const options: StrategyOptions = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: PUB_KEY,
	algorithms: ['RS256'],
	ignoreExpiration: true, // Prevents throwing default 401 Unauthorized error
};

const strategy = new JwtStrategy(options, async (payload, done) => {
	// Handle expired tokens. Returns a new TokenExpiredError so it can be handled
	// in the errorHandler middleware
	if (payload.exp < Math.floor(Date.now() / 1000)) {
		const err = new TokenExpiredError(
			'Your session has expired. Please log in again.',
			payload.exp
		);
		return done(err, false);
	}

	try {
		const user = await prisma.user.findUniqueOrThrow({
			where: {
				id: payload.sub,
			},
		});

		return done(null, user);
	} catch (err) {
		return done(err, false);
	}
});

export default strategy;
