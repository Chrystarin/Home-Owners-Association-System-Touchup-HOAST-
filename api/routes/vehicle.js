const router = require('express').Router();
const fileUpload = require('express-fileupload');

const asyncHandler = require('../middlewares/asyncHandler');
const {
	allowResident,
	allowAdmin,
	allowGuard
} = require('../middlewares/authorization');

const { getVehicles, addVehicle } = asyncHandler(
	require('../controllers/vehicleController')
);

/**
 * Get vehicles
 *
 * plateNumber - optional [1 | n]
 *
 * [User] - owned vehicles
 *
 * [Employee]
 * hoaId
 *
 * [Resident]
 * homeId
 */
router.get('/', allowAdmin, allowGuard, allowResident, getVehicles);

/**
 * Add vehicle
 *
 * plateNumber
 * brand
 * model
 * type
 * color
 */
router.post('/', fileUpload(), addVehicle);

module.exports = router;
