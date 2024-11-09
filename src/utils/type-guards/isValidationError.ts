import { ValidationError } from 'express-validator';

// Each union member of ValidationError has a 'type' field with the following
// values
type ValidationErrorType =
	| 'alternative'
	| 'alternative_grouped'
	| 'unknown_fields'
	| 'field';

const validTypes: ValidationErrorType[] = [
	'alternative',
	'alternative_grouped',
	'unknown_fields',
	'field',
];

export const isValidationError = (err: unknown): err is ValidationError[] => {
	return (
		Array.isArray(err) &&
		err.length > 0 &&
		'type' in err[0] &&
		validTypes.includes(err[0].type as ValidationErrorType)
	);
};
