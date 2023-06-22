const router = require('express').Router();

const asyncHandler = require('../middlewares/asyncHandler');
const {
	allowAdmin,
	allowGuard,
	notUser,
	allowResident,
} = require('../middlewares/authorization');

const { registerHoa, getHoas, addGuard, retireGuard, getGuards, joinHoa } =
	asyncHandler(require('../controllers/hoaController'));

/**
 * Register a new HOA
 *
 * name
 * street
 * barangay
 * city
 * province
 */
router.post('/register', registerHoa);

/**
 * Create a join request in HOA
 *
 * hoaId
 * name
 * number
 * street
 * phase - optional
 */
router.post('/join', joinHoa);

/**
 * hoaId - optional [1 | n]
 */
router.get('/', getHoas);

/**
 * Get all guards
 *
 * hoaId
 * guardId - optional [1 | n]
 * 
 * [Resident]
 * homeId
 */
router.get('/guards', allowAdmin, allowGuard, allowResident, notUser, getGuards);

/**
 * Add new guard
 *
 * hoaId
 * userId
 */
router.post('/guards', allowAdmin, notUser, addGuard);

/**
 * Retire guard
 *
 * hoaId
 * guardId
 */
router.patch('/guards', allowAdmin, notUser, retireGuard);

module.exports = router;
