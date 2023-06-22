const Home = require('../models/Home');

module.exports = async (query) => {
	const homes =
		query instanceof Array
			? query
			: await Home.find(query)
					.lean()
					.populate('hoa residents.user')
					.exec();

	// Get visitors of each home
	const visitors = homes.reduce(
		(home, { homeId, visitors, hoa: { hoaId: hoa } }) => [
			...home,
			// Add home property to each visitor
			...visitors.map((visitor) => ({ hoa, home: homeId, ...visitor }))
		],
		[]
	);

	// Get residents of each home
	const residents = homes.reduce(
		(home, { homeId, residents }) => [
			...home,
			// Add home property to each resident
			...residents.map((resident) => ({ home: homeId, ...resident }))
		],
		[]
	);

	// Get all vehicles of each resident of each home
	const vehicles = residents.reduce(
		(resident, { user: { userId: owner, vehicles } }) => [
			...resident,
			// Add owner property to each vehicle
			...vehicles.map((vehicle) => ({ owner, ...vehicle }))
		],
		[]
	);

	return { visitors, residents, vehicles };
};
