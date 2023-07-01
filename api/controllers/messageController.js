const { roles } = require('../helpers/constants');
const { NotFoundError, InvalidInputError } = require('../helpers/errors');
const HOA = require('../models/HOA');
const Message = require('../models/Message');
const User = require('../models/User');

const getMessages = async (req, res, next) => {
    const { userId, guardId } = req.query;

    const user = await User.findOne({ userId });
    if (user === null) throw NotFoundError('User not found');

    const guard = await User.findOne({ userId: guardId });
    if (guard === null) throw NotFoundError('Guard not found');

    const messages = await Message.find({
        guard: guard._id,
        user: user._id
    }).exec();

    res.json(messages);
};

const sendMessage = async ({ userId, guardId, hoaId, sender, receiver, content }) => {
    if (userId === guardId || sender === receiver) throw new InvalidInputError('Sender and receiver cannot be the same');

    const user = await User.findOne({ userId });
    if (user === null) throw NotFoundError('User not found');

    const guard = await User.findOne({ userId: guardId });
    if (guard === null) throw NotFoundError('Guard not found');

    const isGuardActive = await HOA.findOne({ hoaId, 'guards.user': guard._id, 'guard.status': 'active' });
    if (!isGuardActive) throw NotFoundError('Guard is not active');

    await Message.create({
        guard: guard._id,
        user: user._id,
        sender,
        receiver,
        content
    });
};

module.exports = { getMessages, sendMessage };
