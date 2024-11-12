import { Request, Response, NextFunction } from 'express';
import { ValidationError } from 'express-validator';
import { TokenExpiredError } from 'jsonwebtoken';
import { isValidationError } from '../utils/type-guards/isValidationError';

const errorHandler = (
	err: Error | ValidationError[] | TokenExpiredError,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	// express-validator errors
	if (isValidationError(err)) {
		if (err[0].type === 'field') {
			res.status(422).json(err);
			return;
		}
	}

	if (err instanceof TokenExpiredError) {
		res.status(401).json({ msg: err.message });
		return;
	}

	next(err);
};

export default errorHandler;
