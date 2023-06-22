const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

const { UnauthorizedError } = require('../helpers/errors');
const { JWT_SECRET } = process.env;
const { genUserId } = require('../helpers/generateId');
const { checkString, checkEmail } = require('../helpers/validData');

const createToken = (userId) =>
    jwt.sign({ userId, createdAt: new Date() }, JWT_SECRET, {
        expiresIn: '7d'
    });
const cookieOptions = { httpOnly: true, sameSite: 'none', secure: true };

const signup = async (req, res, next) => {
    const { firstName, lastName, email, password } = req.body;

    checkString(firstName, 'First Name');
    checkString(lastName, 'Last Name');
    checkString(password, 'Password');
    checkEmail(email);

    // Create user
    const user = await User.create({
        userId: genUserId(),
        name: { firstName, lastName },
        credentials: { email, password: await bcrypt.hash(password, 10) }
    });

    res.status(201).cookie('access-token', createToken(user.userId), cookieOptions).json({ message: 'Account created', userId: user.userId });
};

const login = async (req, res, next) => {
    const { email, password } = req.body;

    checkEmail(email);
    checkString(password, 'Password');

    // Find email
    const user = await User.findOne({ 'credentials.email': email }).exec();
    if (!user) throw new UnauthorizedError('Incorrect email');

    // Check password
    const samePassword = await bcrypt.compare(password, user.credentials.password);
    if (!samePassword) throw new UnauthorizedError('Incorrect password');

    res.status(201).cookie('access-token', createToken(user.userId), cookieOptions).json({ user: user });
};

const getUser = async (req, res, next) => {
    const { user } = req.user;
    const {
        credentials: { email }
    } = user;

    res.json({ ...user.toJSON(), email });
};

const updateUser = async (req, res, next) => {
    const { firstName, lastName, email, password } = req.body;
    const { user } = req.user;

    // Update user
    user = {
        ...user,
        name: { firstName, lastName },
        credentials: { email, password }
    };
    await user.save();

    res.json({ message: 'User updated' });
};

module.exports = { signup, login, getUser, updateUser };
