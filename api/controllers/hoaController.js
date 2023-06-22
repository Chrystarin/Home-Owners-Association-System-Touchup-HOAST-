const HOA = require('../models/HOA');
const User = require('../models/User');
const Request = require('../models/Request');
const Home = require('../models/Home');
const {
	UserNotFoundError,
	HOANotFoundError,
	DuplicateEntryError,
	NotFoundError
} = require('../helpers/errors');
const { checkString } = require('../helpers/validData');
const { genHoaId, genRequestId } = require('../helpers/generateId');

const registerHoa = async (req, res, next) => {
	const { name, street, barangay, city, province } = req.body;
	const { user } = req.user;

	// Validate strings
	checkString(barangay, 'Barangay');
	checkString(city, 'City');
	checkString(name, 'HOA Name');
	checkString(province, 'Province');
	checkString(street, 'Street');

	// Create HOA
	const hoa = await HOA.create({
		hoaId: genHoaId(),
		name,
		address: { street, barangay, city, province },
		admin: user._id
	});

	res.status(201).json({ message: 'HOA created', hoaId: hoa.hoaId });
};

const getHoas = async (req, res, next) => {
	const { hoaId } = req.query;

	// Validate input
	checkString(hoaId, 'HOA ID', true);

	// Find hoas
	let hoas = await HOA.find();

	// Get specific hoa
	if (hoaId) {
		hoas = await HOA.findOne({ hoaId });
		if (!hoas) throw new HOANotFoundError();
	}

	res.json(hoas);
};

const joinHoa = async (req, res, next) => {
	const { hoaId, name, contactNo, color, number, street, phase } = req.body;
	const { user } = req.user;
    
	console.log(req.body)

	checkString(hoaId, 'HOA ID');
	checkString(name, 'Home Name');
	checkString(color, 'Home Color');
	checkString(number, 'Home Number');
	checkString(street, 'Street');
    checkString(contactNo, 'Contact Number');
	checkString(phase, 'Phase', true);

	// Find HOA
	const hoa = await HOA.findOne({ hoaId });
	if (!hoa) throw new HOANotFoundError();

	// Check if address already exists
	const homeExists = await Home.exists({
		hoa: hoa._id,
		'address.number': number,
		'address.street': street,
		'address.phase': phase
	});
	if (homeExists) throw new DuplicateEntryError('Home already saved');

	// Create request
	const request = await Request.create({
		requestId: genRequestId(),
		hoa: hoa._id,
		requestor: user._id,
		details: { name, color, number, street, phase, contactNo }	
	});

	res.status(201).json({
		message: 'Join request created',
		requestId: request.requestId
	});
};

const addGuard = async (req, res, next) => {
	const { userId } = req.body;
	const { hoa } = req.user;

	// Validate input
	checkString(userId, 'User ID');

	// Find user (to be guard)
	const user = await User.findOne({ userId });
	if (!user) throw new UserNotFoundError();

	// Add guard to HOA
	hoa.guards.push({ user: user._id });
	await hoa.save();

	res.status(201).json({ message: 'Guard added' });
};

const retireGuard = async (req, res, next) => {
	const { guardId } = req.body;
	const { hoa } = req.user;

	// Validate input
	checkString(guardId, 'Guard ID');

	// Find the active guard
	const guard = hoa.guards.find(
		({ user: { userId }, status }) =>
			userId == guardId && status == 'active'
	);
	if (!guard) throw new NotFoundError('Can not find active guard');

	// Update status of guard
	guard.status = 'retired';
	await hoa.save();

	res.json({ message: 'Guard retired', guardId });
};

const getGuards = async (req, res, next) => {
	const { guardId } = req.query;
	const { hoa } = req.user;

	checkString(guardId, 'Guard ID', true);

	let guards = hoa.guards;

	// Get specific guard
	if (guardId) {
		guards = hoa.guards.find(({ user: { userId } }) => userId == guardId);

		if (!guards) throw new NotFoundError('Incorrect guard id');
	}

	res.json(guards);
};

module.exports = {
	registerHoa,
	getHoas,
	joinHoa,
	addGuard,
	retireGuard,
	getGuards
};
