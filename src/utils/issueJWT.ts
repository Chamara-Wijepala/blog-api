import fs from 'fs';
import path from 'path';
import jwt, { SignOptions } from 'jsonwebtoken';

const pathToKey = path.join(__dirname, '..', '..', 'keys/id_rsa_priv.pem');
const PRIV_KEY = {
	key: fs.readFileSync(pathToKey, 'utf-8'),
	passphrase: process.env.KEY_PASSPHRASE,
};

const issueJWT = (userId: string) => {
	const expiresIn = '1d';

	const payload = {
		sub: userId,
		iat: Date.now(),
	};
	const options: SignOptions = {
		expiresIn: expiresIn,
		algorithm: 'RS256',
	};

	const signedToken = jwt.sign(payload, PRIV_KEY, options);

	return {
		token: 'Bearer ' + signedToken,
		expiresIn,
	};
};

export default issueJWT;
