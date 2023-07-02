const { roles } = require('../helpers/constants');
const { NotFoundError, InvalidInputError } = require('../helpers/errors');
const HOA = require('../models/HOA');
const Message = require('../models/Message');
const User = require('../models/User');

const getMessages = async (req, res, next) => {
    const { userId, guardId } = req.query;

    console.log(req.query);

    const user = await User.findOne({ userId });
    if (user === null) throw new NotFoundError('User not found');

    const guard = await User.findOne({ userId: guardId });
    if (guard === null) throw new NotFoundError('Guard not found');

    const messages = await Message.find({
        guard: guard._id,
        user: user._id
    })
        .populate('guard user')
        .exec();

    res.json(messages);
};

const sendMessage = async (data) => {
    const { userId, guardId, hoaId, sender, receiver, content } = data;

    console.log(data);

    // console.log('Message Sent');
    // console.log(data);

    if (userId === guardId || sender === receiver) throw new InvalidInputError('Sender and receiver cannot be the same');

    const user = await User.findOne({ userId });
    if (user === null) throw new NotFoundError('User not found');

    const guard = await User.findOne({ userId: guardId });
    if (guard === null) throw new NotFoundError('Guard not found');

    const isGuardActive = await HOA.findOne({ hoaId, 'guards.user': guard._id, 'guard.status': 'active' });
    if (!isGuardActive) throw new NotFoundError('Guard is not active');

    await Message.create({
        guard: guard._id,
        user: user._id,
        sender,
        receiver,
        content
    });

    return { user, guard, sender, receiver, content };
};

module.exports = { getMessages, sendMessage };
