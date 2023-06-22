const router = require('express').Router();

const asyncHandler = require('../middlewares/asyncHandler');

const { addDevice } = asyncHandler(require('../controllers/deviceController'));

router.post('/', addDevice);

module.exports = router;
