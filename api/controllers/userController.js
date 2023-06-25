const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

const { UnauthorizedError } = require('../helpers/errors');
const { JWT_SECRET } = process.env;
const { genUserId, genPassword, genHomeId } = require('../helpers/generateId');
const { checkString, checkEmail } = require('../helpers/validData');
const Home = require('../models/Home');
const sendEmail = require('../helpers/sendEmail');

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

    // Update user
    user = {
        ...user,
        name: { firstName, lastName },
        credentials: { email, password }
    };
    await user.save();

    res.json({ message: 'User updated' });
};

const addHomeowner = async (req, res, next) => {
    const {
        resident: { firstName, lastName, email, contactNo },
        home: { homeNo, street, phase }
    } = req.body;
    const { hoa } = req.user;


    const genPass = genPassword();

    // Create user
    const homeowner = await User.create({
        userId: genUserId(),
        name: { firstName, lastName },
        credentials: { email, password: await bcrypt.hash(genPass, 10) }
    });

    // Create home
    const home = await Home.create({
        homeId: genHomeId(),
        name: lastName + "'s Residence",
        owner: homeowner._id,
        hoa: hoa._id,
        address: { number: homeNo, street, phase },
        contactNo,
        residents: [{ user: homeowner._id }]
    });

    res.status(201).json({
        message: 'Homeowner and Home added',
        homeowner,
        home,
        credentials: {
            email,
            password: genPass
        }
    });
};

module.exports = { signup, login, getUser, updateUser, addHomeowner };

const forgetPassword = async (req, res, next) => {
    const { email, NewPassword } = req.body;
    const user = await user.findOne({ email }).exec();

    if(!user) new UnauthorizedError('User not found');

    user.credentials.password = await bcrypt.hash(NewPassword, 10);
    await user.save();

    res.json({ message: 'Password Reset Successfully' });
};

const sendMail = async (req, res, next) => {
    const { email, message } = req.body;

    console.log(email, message);

    checkEmail(email);

    await sendEmail(email, message);
    
    res.json({ message: 'Email sent' });
}

module.exports = { signup, login, getUser, updateUser, forgetPassword, sendMail, addHomeowner };
