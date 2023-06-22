const router = require('express').Router();

const {
	allowAdmin,
	allowGuard,
	allowHomeowner,
	notUser
} = require('../middlewares/authorization');
const asyncHandler = require('../middlewares/asyncHandler');

const { getHomes, updateHome } = asyncHandler(
	require('../controllers/homeController')
);

/**
 * Get homes
 *
 * homeId - optional [one | many]
 *
 * [User] - owned homes
 *
 * [Employee]
 * hoaId
 */
router.get('/', allowAdmin, allowGuard, getHomes);

/**
 * Update home details
 *
 * homeId
 */
router.patch('/', allowHomeowner, notUser, updateHome);

module.exports = router;
