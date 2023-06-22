const { UnauthorizedError, ForbiddenError } = require('../helpers/errors');
const HOA = require('../models/HOA');
const User = require('../models/User');
const bcrypt = require('bcrypt');

const addDevice = async (req, res, next) => {
	const { email, password, hoaId, deviceIP } = req.body;

	// Find user by email and check password using bcrypt
	const user = await User.findOne({ 'credentials.email': email }, { 'credentials.password': 1 }).exec();
	if (!user || !bcrypt.compareSync(password, user.credentials.password))
		throw new UnauthorizedError('Invalid user credentials');

	// Check if user is admin or guard of hoaId
	const hoa = await HOA.findOne({
		hoaId,
		$or: [
			{ admin: user._id },
			{ 'guards.user': user._id, 'guards.status': 'active' }
		]
	});
	if (!hoa) throw new ForbiddenError('User not guard or admin of HOA');


	console.log("OLD DATA")
	console.log(hoa)

	console.log("DEVICE IP")
	console.log(deviceIP)

	hoa.deviceIP = deviceIP;
	await hoa.save();

	console.log("NEW DATA")
	console.log(hoa)

	res.status(201).send('Device added');
};

module.exports = { addDevice };
