import { Request, Response, NextFunction } from 'express';
import { ValidationError } from 'express-validator';
import { isValidationError } from '../utils/type-guards/isValidationError';

const errorHandler = (
	err: Error | ValidationError[],
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

	next(err);
};

export default errorHandler;
