const router = require('express').Router();

const {
	allowAdmin,
	allowHomeowner,
	notUser
} = require('../middlewares/authorization');
const asyncHandler = require('../middlewares/asyncHandler');

const { createDue, getDues } = asyncHandler(
	require('../controllers/dueController')
);

/**
 * Get dues
 *
 * dueId - optional [1 | n]
 *
 * [Admin]
 * hoaId
 *
 * [Homeowner]
 * homeId
 */
router.get('/', allowAdmin, allowHomeowner, notUser, getDues);

/**
 * Create a due
 *
 * hoaId
 * homeId
 * amount
 * months
 */
router.post('/', allowAdmin, notUser, createDue);

module.exports = router;
