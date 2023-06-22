const router = require('express').Router();

const asyncHandler = require('../middlewares/asyncHandler');
const {
    allowAdmin,
    notUser
} = require('../middlewares/authorization');

const { getRequests, processRequest } = asyncHandler(
	require('../controllers/requestController')
);

/**
 * Get requests
 * 
 * requestId - optional [1 | n]
 * 
 * [Admin]
 * hoaId
 */
router.get('/', allowAdmin, getRequests);

/**
 * Process the request
 *
 * hoaId
 * requestId
 * status
 */
router.patch('/', allowAdmin, notUser, processRequest);

module.exports = router;
