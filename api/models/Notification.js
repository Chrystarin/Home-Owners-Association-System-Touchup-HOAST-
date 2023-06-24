const { Schema, model } = require('mongoose');
const { ObjectId } = Schema.Types;

module.exports = model(
    'Notification',
    new Schema({
        notificationId: {
            type: String,
            required: [true, 'Notification ID is required']
        },
        message: {
            type: String,
            required: [true, 'Message is required']
        },
        type: {
            type: String,
            enum: {
                values: ['DUE', 'VISITOR', 'HOMESENT', 'HOMEAPPROVED'],
                message: "'{VALUE}' is not supported"
            },
            required: [true, 'Notification type is required']
        },
        user: {
            type: ObjectId,
            ref: 'User',
            required: [true, 'User is required']
        }
    })
);
