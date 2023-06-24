const HOA = require('../models/HOA');
const Request = require('../models/Request');
const Home = require('../models/Home');

const { checkString } = require('../helpers/validData');
const { RequestNotFoundError } = require('../helpers/errors');
const { genHomeId, genNotificationId } = require('../helpers/generateId');
const {
	roles: { USER, ADMIN }
} = require('../helpers/constants');
const Notification = require('../models/Notification');
const { notifType, messages } = require('../helpers/createNotification');

const getRequests = async (req, res, next) => {
	const { requestId } = req.query;
	const { type } = req.user;

	// Validate input
	checkString(requestId, 'Request ID', true);

	let requests;

	if (type == USER) {
		const { user } = req.user;
		requests = await Request.find({ requestor: user._id })
			.populate('hoa')
			.exec();
	}

	if (type == ADMIN) {
		const { hoa } = req.user;
		requests = await Request.find({ hoa: hoa._id })
			.populate('hoa requestor')
			.exec();
	}

	// Get specific request
	if (requestId) {
		requests = requests.find(({ requestId: ri }) =>
			requestId ? requestId == ri : true
		);

		if (!requests) throw new RequestNotFoundError();
	}

	res.json(requests);
};

const processRequest = async (req, res, next) => {
	const { requestId, status } = req.body;
	const { hoa } = req.user;

	// Validate input
	checkString(requestId, 'Request ID');
	checkString(status, 'Request Status');

	// Find request
	const request = await Request.findOne({
		requestId,
		hoa: hoa._id,
		status: 'pending'
	});
	if (!request) throw new RequestNotFoundError();

	// Response details
	let resStatus = 200;
	let resMessage = { message: 'Request rejected' };

	// Process request if approved
	if (status == 'approved') {
		const { name, color, ...address } = request.details;
		const { contactNo } = request.details;

		// Create home
		const home = await Home.create({
			homeId: genHomeId(),
			name,
			color,
			contactNo,
			owner: request.requestor,
			hoa: hoa._id,
			address,
			residents: [{ user: request.requestor }]
		});

        // Update request
        await Notification.create({
            notificationId: genNotificationId(),
            message: messages[notifType.HomeRequestApproved],
            type: notifType.HomeRequestApproved,
            user: home.owner
        })

		resStatus = 201;
		resMessage = { message: 'Home created', homeId: home.homeId };
	}

	// Update request
	request.status = status;
	await request.save();

	res.status(resStatus).json(resMessage);
};

module.exports = { processRequest, getRequests };
