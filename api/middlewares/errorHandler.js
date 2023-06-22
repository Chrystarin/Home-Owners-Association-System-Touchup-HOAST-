module.exports = (error, req, res, next) => {
	// console.log(error);

	const { code } = error;
	let { name } = error;

	// Validations
	if (name === 'ValidationError') {
		const { errors } = error;

		error = {
			...error,
			name,
			message: Object.values(errors).reduce(
				(output, { path, message }) => [...output, { path, message }],
				[]
			),
			status: 422
		};
	}

	// unique
	if (code === 11000) {
		const { keyValue } = error;
		const [[property, value]] = Object.entries(keyValue);

		error = {
			...error,
			name: 'DuplicateError',
			message: `A ${property} of ${value} already exists`,
			status: 409
		};
	}

	// jsonwebtoken
	if (name === 'TokenExpiredError') {
		error = { ...error, message: 'Token expired', status: 401 };
	}
	if (name === 'JsonWebTokenError') {
		error = { ...error, message: 'Token malformed', status: 401 };
	}

	({ name } = error);
	const { status, message } = error;

	res.status(status || 500).json({ name, message });
};
