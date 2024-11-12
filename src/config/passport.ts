import fs from 'fs';
import path from 'path';
import {
	Strategy as JwtStrategy,
	ExtractJwt,
	StrategyOptions,
} from 'passport-jwt';
import prisma from '../db/client';

const pathToKey = path.join(__dirname, '..', '..', 'keys/id_rsa_pub.pem');
const PUB_KEY = fs.readFileSync(pathToKey, 'utf-8');

const options: StrategyOptions = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: PUB_KEY,
	algorithms: ['RS256'],
};

const strategy = new JwtStrategy(options, async (payload, done) => {
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
