const router = require('express').Router();

const asyncHandler = require('../middlewares/asyncHandler');
const {
	allowResident,
	allowAdmin,
	allowGuard,
	notUser
} = require('../middlewares/authorization');

const { addRecord, getRecords } = asyncHandler(
	require('../controllers/logController')
);

/**
 * Get logs of user
 *
 * logId - optional [1 | n]
 *
 * [User] => vehicle | user
 *
 * [Resident] => visitor
 * homeId
 *
 * [Employee] => vehicle | vistior | user
 * hoaId
 */
router.get('/', allowAdmin, allowGuard, allowResident, getRecords);

/**
 * hoaId
 * objectId,m
 * logType
 */
router.post('/', allowAdmin, allowGuard, notUser, addRecord);

module.exports = router;
