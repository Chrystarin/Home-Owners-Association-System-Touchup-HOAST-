const router = require('express').Router();

const asyncHandler = require('../middlewares/asyncHandler');
const authenticate = require('../middlewares/authentication');

const { signup, login, getUser, updateUser, forgetPassword, sendMail } = asyncHandler(
	require('../controllers/userController')
);

/**
 * Signup user
 *
 * firstName
 * lastName
 * email
 * password
 */
router.post('/signup', signup);

/**
 * Login user
 *
 * email
 * password
 */
router.post('/login', login);

router.post('/verify', sendMail)

router.patch('/updatepassword', forgetPassword);

router.use(authenticate);

/**
 * Get user info
 */
router.get('/', getUser);

/**
 * Edit user info
 *
 * firstName
 * lastName
 * email
 * password
 */
router.patch('/', updateUser);

module.exports = router;
