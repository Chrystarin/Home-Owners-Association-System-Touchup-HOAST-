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
router.get('/', allowAdmin, allowGuard, allowResident, getVisitors);

/**
 * Create a visitor
 *
 * name
 * purpose
 * arrivalDate
 * departureDate
 * note
 */
router.post('/', allowResident, notUser, addVisitor);

module.exports = router;
