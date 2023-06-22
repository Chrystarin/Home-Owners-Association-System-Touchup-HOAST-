const { Schema, model } = require('mongoose');
const { ObjectId } = Schema.Types;

module.exports = model(
	'Request',
	new Schema(
		{
			requestId: { type: String, unique: true, required: true },
			hoa: {
				type: ObjectId,
				ref: 'HOA',
				required: [true, 'HOA is required']
			},
			requestor: {
				type: ObjectId,
				ref: 'User',
				required: [true, 'Requestor is required']
			},
			details: {
				name: {
					type: String,
					required: [true, 'Home Name is required']
				},
				number: {
					type: String,
					required: [true, 'Home Number is required']
				},
				street: {
					type: String,
					required: [true, 'Street is required']
				},
                color: {
                    type: String,
                    required: [true, 'Color is required'],
                    enum: {
                        values: [
                            'red',
                            'orange',
                            'yellow',
                            'green',
                            'blue',
                            'violet'
                        ],
                        message: "'{VALUE}' is not supported"
                    }
                },
				contactNo: {
					type: String,
					required: [true, 'Contact Number is required']
				},
				phase: String
			},
			status: {
				type: String,
				enum: ['pending', 'approved', 'rejected'],
				default: 'pending'
			}
		},
		{ timestamps: true }
	)
);
