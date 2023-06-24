const Notification = require('../models/Notification');
const { genNotificationId } = require('./generateId');

const notifType = {
    DueNotPaid: 'DUE',
    NewVisitor: 'VISITOR',
    HomeRequestSent: 'HOMESENT',
    HomeRequestApproved: 'HOMEAPPROVED'
};

const messages = {};

const createNotification = (type, object, documentId) =>
    Notification.create({
        notificationId: genNotificationId(),
        message: messages[type],
        type,
        user: object[documentId]
    });

module.exports = {
    notifType,
    messages,
    createNotification
};
