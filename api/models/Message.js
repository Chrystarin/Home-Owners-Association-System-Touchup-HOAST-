const { Schema, model } = require('mongoose');
const { ObjectId } = Schema.Types;

module.exports = model(
    "Message",
    new Schema(
        {
            guard: {
                type: ObjectId,
                ref: 'User',
                required: [true, 'Guard is required']
            },
            user: {
                type: ObjectId,
                ref: 'User',
                required: [true, 'User is required']
            },
            sender: {
                type: String,
                enum: {
                    values: ['guard', 'user'],
                    message: "'{VALUE}' is not supported sender"
                },
                required: [true, 'Sender is required']
            },
            receiver: {
                type: String,
                enum: {
                    values: ['guard', 'user'],
                    message: "'{VALUE}' is not supported sender"
                },
                required: [true, 'Sender is required']
            },
            content: {
                type: String,
                required: [true, 'Content is required']
            }
        },
        { timestamps: true }
    )
)