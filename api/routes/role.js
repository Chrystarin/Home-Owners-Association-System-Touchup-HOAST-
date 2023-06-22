const router = require('express').Router();

const HOA = require('../models/HOA');
const Home = require('../models/Home');

const asyncHandler = require('../middlewares/asyncHandler');
const { allowAdmin, allowGuard, allowHomeowner, allowResident } = require('../middlewares/authorization')

const { getRoles } = asyncHandler({
	getRoles: async (req, res, next) => {
		const { user } = req.user;

        let role = {}
        let hoas = {}

		const residents = await Home.find({ 'residents.user': user._id }).lean();
		const homes = residents.filter(({ owner }) => owner.equals(user._id));
		const admins = await HOA.find({ admin: user._id }).lean()
		const guards = await HOA.find({ 'guards.user': user._id }).lean()

		const roles = {
			admin: admins.map(({ hoaId }) => hoaId),
			guard: guards.map(({ hoaId }) => hoaId),
			homeowner: homes.map(({ homeId }) => homeId),
			resident: residents.map(({ homeId }) => homeId)
		}

		// const adminHoa = await HOA.find({ admin: user._id }).lean().select('hoaId');

        // const guardHoa = await HOA.find({ guards: user._id }).lean().select('hoaId');

        // if (adminHoa.length>0) role = 'admin'
        // if (guardHoa.length>0) role = 'guard'
        // if (role=='admin') hoas = adminHoa
        // if (hoas=='guard') hoas = guardHoa

		// res.json({ role, homes, hoas});
        
		res.json(roles);
	}
});

router.get('/', getRoles);

module.exports = router;
