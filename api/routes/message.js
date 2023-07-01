const router = require('express').Router();

const asyncHandler = require('../middlewares/asyncHandler');
const {
	allowResident,
	allowGuard,
	notUser
} = require('../middlewares/authorization');

const { getMessages } = asyncHandler(
	require('../controllers/messageController')
);

router.use(allowGuard);

router.get('/', getMessages);

module.exports = router;