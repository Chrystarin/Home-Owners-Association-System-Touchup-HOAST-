const Home = require('../models/Home');

const { NotFoundError } = require('../helpers/errors');
const {
	roles: { USER },
	types: { EMPLOYEE }
} = require('../helpers/constants');
const { checkString } = require('../helpers/validData');

const getHomes = async (req, res, next) => {
	const { homeId } = req.query;
	const { type } = req.user;

	// Validate input
	checkString(homeId, 'Home ID', true);

	let homes;

	if (type == USER) {
		const { user } = req.user;
		homes = await Home.find({ owner: user._id })
			.populate('residents.user hoa owner')
			.exec();
	}

	if (EMPLOYEE.has(type)) {
		const { hoa } = req.user;
		homes = await Home.find({ hoa: hoa._id })
			.populate('residents.user hoa owner')
			.exec();
	}

	// Get specific home
	if (homeId) {
		homes = homes.find(({ homeId: hi }) => homeId == hi);

		if (!homes) throw new NotFoundError('Incorrect home id');
	}

	res.json(homes);
};

const updateHome = async (req, res, next) => {
	const { name, color, contactNo } = req.body;
	const { home } = req.user;

	// Update home
	home.name = name;
    home.color = color;
    home.contactNo = contactNo;
	await home.save();

	res.json({ message: 'Home updated' });
};

module.exports = { getHomes, updateHome };
