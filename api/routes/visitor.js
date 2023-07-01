const router = require('express').Router();

const asyncHandler = require('../middlewares/asyncHandler');
const {
	allowResident,
	notUser,
	allowGuard,
	allowAdmin
} = require('../middlewares/authorization');

const { addVisitor, getVisitors } = asyncHandler(
	require('../controllers/visitorController')
);

router.use(allowAdmin, allowGuard, allowResident)

/**
 * Get visitors
 *
 * visitorId - optional [1 | n]
 *
 * [Employee]
 * hoaId
 *
 * [Resident]
 * homeId
 */
router.get('/', getVisitors);

/**
 * Create a visitor
 *
 * name
 * purpose
 * arrivalDate
 * departureDate
 * note
 */
router.post('/', notUser, addVisitor);

module.exports = router;
