class NotFoundError extends Error {
	constructor(message) {
		super(message);
		this.name = 'NotFoundError';
		this.status = 404;
	}
}

class UserNotFoundError extends NotFoundError {
	constructor() {
		super('Can not find user.');
	}
}

class HOANotFoundError extends NotFoundError {
	constructor() {
		super('HOA not existing');
	}
}

class ResidentNotFoundError extends NotFoundError {
	constructor() {
		super('User is not an active resident');
	}
}

class VisitorNotFoundError extends NotFoundError {
	constructor() {
		super('Visitor not existing');
	}
}

class RequestNotFoundError extends NotFoundError {
	constructor() {
		super('Request not existing');
	}
}

class VehicleNotFoundError extends NotFoundError {
	constructor() {
		super('Vehicle not existing');
	}
}

class InvalidInputError extends Error {
	constructor(message) {
		super(message);
		this.name = 'InvalidInputError';
		this.status = 422;
	}
}

class UnauthorizedError extends Error {
	constructor(message) {
		super(message);
		this.name = 'UnauthorizedError';
		this.status = 401;
	}
}

class ForbiddenError extends Error {
	constructor(message) {
		super(message);
		this.name = 'ForbiddenError';
		this.status = 403;
	}
}

class DuplicateEntryError extends Error {
	constructor(message) {
		super(message);
		this.name = 'DuplicateEntryError';
		this.status = 409;
	}
}

class InternalServerError extends Error {
	constructor() {
		super('Server has encountered an unexpected condition');
		this.name = 'InternalServerError';
		this.status = 500;
	}
}

module.exports = {
	NotFoundError,
	UserNotFoundError,
	HOANotFoundError,
	RequestNotFoundError,
	VisitorNotFoundError,
	VehicleNotFoundError,
	ResidentNotFoundError,
	UnauthorizedError,
	ForbiddenError,
	InternalServerError,
	InvalidInputError,
	DuplicateEntryError
};
