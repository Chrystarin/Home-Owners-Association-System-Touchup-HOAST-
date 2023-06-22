const Due = require('../models/Due');
const Home = require('../models/Home');

const {
	roles: { ADMIN, HOMEOWNER }
} = require('../helpers/constants');
const { NotFoundError } = require('../helpers/errors');
const { genDueId } = require('../helpers/generateId');
const { checkString, checkNumber } = require('../helpers/validData');

const getDues = async (req, res, next) => {
	const { dueId } = req.body;
	const { type } = req.user;

	// Validate input
	checkString(dueId, 'Due ID', true);

	let dues;

	if (type == ADMIN) {
		const { home } = req.user;
		dues = await Due.find({ home: home._id });
	}

	if (type == HOMEOWNER) {
		const { hoa } = req.user;

		// Get homes under hoa
		const homes = await Home.find({ hoa: hoa._id }).lean();

		// Combine all dues from each home
		dues = homes.reduce(
			async (home, { _id }) => [
				...home,
				// Get dues from each home
				...(await Due.find({ hoa: _id }).lean())
			],
			[]
		);
	}

	// Get specific due
	if (dueId) {
		dues = dues.find(({ dueId: di }) => dueId == di);

		if (!dues) throw new NotFoundError('Incorrect due id');
	}

	res.json(dues);
};

const createDue = async (req, res, next) => {
	const { homeId, amount, months } = req.body;
	const { hoa } = req.user;

	console.log(req.body);

	// Validate input
	checkString(homeId, 'Home ID');
	checkNumber(amount, 'Amount');
	checkNumber(months, 'Months');

	// Find Home
	const home = await Home.findOne({ homeId, hoa: hoa._id });
	if (!home) throw new NotFoundError('Home');

	// Create due
	const due = new Due({
		dueId: genDueId(),
		home: home._id,
		amount,
		months,
		from: home.paidUntil
	});

	const from = new Date(home.paidUntil);

	// Calculate date
	const paidUntil = from.setMonth(from.getMonth() + months);

	// Update due's paid to
	due.to = paidUntil;
	await due.save();

	// Update home's paid until
	home.paidUntil = from;
	await home.save();

	console.log(home)

	res.status(201).json({ message: 'Due added', dueId: due.dueId });
};

module.exports = { createDue, getDues };
