const HOA = require('../models/HOA');
const Home = require('../models/Home');

const {
	ForbiddenError,
	HOANotFoundError,
	HomeNotFoundError
} = require('../helpers/errors');
const { checkString } = require('../helpers/validData');
const {
	roles: { ADMIN, GUARD, HOMEOWNER, RESIDENT, USER }
} = require('../helpers/constants');

const allowAdmin = async (req, res, next) => {
	const hoaId = req.body?.hoaId || req.query?.hoaId;
	const { user, type } = req.user;

	if (type != USER) return next();

	try {
		// Validate input
		checkString(hoaId, 'HOA ID');

		// Find HOA
		const hoa = await HOA.findOne({ hoaId, admin: user._id })
			.populate('guards.user')
			.exec();
		if (!hoa) throw new HOANotFoundError();

		req.user.type = ADMIN;
		req.user.hoa = hoa;
	} catch (error) {
	} finally {
		next();
	}
};

const allowGuard = async (req, res, next) => {
	const hoaId = req.body?.hoaId || req.query?.hoaId;
	const { user, type } = req.user;

	if (type != USER) return next();

	try {
		// Validate input
		checkString(hoaId, 'HOA ID');

		// Find HOA
		const hoa = await HOA.findOne({
			hoaId,
			'guards.user': user._id,
			'guards.active': 'active'
		})
			.populate('guards.user')
			.exec();
		if (!hoa) throw new HOANotFoundError();

		req.user.type = GUARD;
		req.user.hoa = hoa;
	} catch (error) {
	} finally {
		next();
	}
};

const allowHomeowner = async (req, res, next) => {
	const homeId = req.body?.homeId || req.query?.homeId;
	const { user, type } = req.user;

	if (type != USER) return next();

	try {
		// Validate input
		checkString(homeId, 'Home ID');

		// Find home
		const home = await Home.findOne({ homeId, owner: user._id })
			.populate('hoa residents.user')
			.exec();
		if (!home) throw new HomeNotFoundError();

		req.user.type = HOMEOWNER;
		req.user.home = home;
	} catch (error) {
	} finally {
		next();
	}
};

const allowResident = async (req, res, next) => {
	const homeId = req.body?.homeId || req.query?.homeId;
	const { user, type } = req.user;

	if (type != USER) return next();

	try {
		// Validate input
		checkString(homeId, 'Home ID');

		// Find home
		const home = await Home.findOne({
			homeId,
			'residents.user': user._id,
			'residents.status': 'active'
		})
			.populate('hoa residents.user')
			.exec();
		if (!home) throw new HomeNotFoundError();

		req.user.type = RESIDENT;
		req.user.home = home;
	} catch (error) {
	} finally {
		next();
	}
};

const notUser = async (req, res, next) => {
	if (req.user.type != USER) return next();
	next(new ForbiddenError('Can not identify user type'));
};

const notAdmin = async (req, res, next) => {
	if (req.user.type != ADMIN) return next();
	next(new ForbiddenError('User can not be an admin'));
};

module.exports = {
	allowAdmin,
	allowGuard,
	allowHomeowner,
	allowResident,
	notUser,
	notAdmin
};
