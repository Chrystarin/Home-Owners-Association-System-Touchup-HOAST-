const router = require('express').Router();

const {
	allowAdmin,
	allowHomeowner,
	notUser
} = require('../middlewares/authorization');
const asyncHandler = require('../middlewares/asyncHandler');

const { createDue, getDues, sendDueNotification } = asyncHandler(
	require('../controllers/dueController')
);

router.use(allowAdmin)

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
router.get('/', allowHomeowner, notUser, getDues);

/**
 * Create a due
 *
 * hoaId
 * homeId
 * amount
 * months
 */
router.post('/', notUser, createDue);

/**
 * hoaId
 */
router.post('/notify', notUser, sendDueNotification);

module.exports = router;
