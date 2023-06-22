const { Schema, model } = require('mongoose');
const { ObjectId } = Schema.Types;

module.exports = model(
	'Home',
	new Schema(
		{
			homeId: { type: String, unique: true, required: true },
			name: { type: String, required: true },
			owner: {
				type: ObjectId,
				ref: 'User',
				required: [true, 'Owner is required']
			},
			hoa: {
				type: ObjectId,
				ref: 'HOA',
				required: [true, 'HOA is required']
			},
			address: {
				number: {
					type: String,
					required: [true, 'Home Number is required']
				},
				street: {
					type: String,
					required: [true, 'Street is required']
				},
				phase: String
			},
			contactNo: {
				type: String,
				required: [true, 'Contact Number is required']
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
			paidUntil: {
				type: Date,
				default: new Date()
			},
			residents: [
				{
					user: {
						type: ObjectId,
						ref: 'User',
						required: [true, 'User is required']
					},
					status: {
						type: String,
						enum: ['active', 'inactive'],
						default: 'active'
					}
				}
			],
			visitors: [
				{
					visitorId: {
						type: String,
						index: { unique: true, sparse: true },
						required: true
					},
					name: {
						type: String,
						required: [true, 'Visitor Name is required']
					},
					purpose: {
						type: String,
						required: [true, 'Purpose is required']
					},
					arrival: {
						type: Date,
						required: [true, 'Arrival is required']
					},
					departure: {
						type: Date,
						required: [true, 'Departure is required']
					},
					note: String
				}
			]
		},
		{ timestamps: true }
	)
);
