const router = require('express').Router();

const asyncHandler = require('../middlewares/asyncHandler');
const authenticate = require('../middlewares/authentication');
const { allowAdmin, allowHomeowner } = require('../middlewares/authorization');

const { signup, login, getUser, updateUser, addHomeowner } = asyncHandler(
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
router.patch('/', updateUser);``

/**
 * Add homeowner
 * 
 * resident
 *     firstName
 *     lastName
 *     email
 *     contactNo
 * home
 *     homeNo
 *     street
 *     phase
 */
router.post('/homeowner', allowAdmin, addHomeowner);

module.exports = router;
