const { InvalidInputError } = require('./errors');

const checkString = (str, property, canbeUndefined = false) => {
	// Check if string is defined
	if (str) {
		// Check if input is type of string
		if (typeof str !== 'string')
			throw new InvalidInputError(`'${property}' is not a string`);

		// Check if string is not empty
		if (!str.trim()) throw new InvalidInputError(`'${property}' is empty`);

		return;
	}

	// Check if canbeUndefined is true if string is undefined
	if (!canbeUndefined)
		throw new InvalidInputError(`'${property}' is not defined`);
};

const checkNumber = (n, property, canbeUndefined) => {
	// Check if n is defined
	if (n) {
		// Check if input is type of number
		if (typeof n !== 'number')
			throw new InvalidInputError(`'${property}' is not a number`);

		return;
	}

	// Check if canbeUndefined is true if n is undefined
	if (!canbeUndefined) throw new InvalidInputError(`'${property}' is not defined`);
};

const checkDate = (date, property) => {
	if (isNaN(new Date(date)))
		throw new InvalidInputError(`'${property} is in invalid date format'`);
};

const checkEmail = (email) => {
	checkString(email, 'Email');

	if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(email))
		throw new InvalidInputError('Invalid email format');
};

module.exports = {
	checkString,
	checkDate,
	checkEmail,
	checkNumber
};
