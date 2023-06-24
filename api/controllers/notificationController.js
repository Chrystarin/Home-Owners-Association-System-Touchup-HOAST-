const Notification = require("../models/Notification");

const getNotifications = async (req, res, next) => {
    const { user } = req.user;

    const notifications = await Notification.find({ user: user._id }).exec();

    res.json(notifications);
};

module.exports = { getNotifications };