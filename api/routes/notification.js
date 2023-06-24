const router = require('express').Router();

const asyncHandler = require('../middlewares/asyncHandler');
const { allowAdmin, allowGuard, allowHomeowner } = require('../middlewares/authorization');
const { getNotifications } = asyncHandler(require('../controllers/notificationController'));

router.get('/', allowAdmin, allowGuard, allowHomeowner, getNotifications);

module.exports = router;