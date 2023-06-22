const { Schema, model } = require('mongoose');
const { ObjectId } = Schema.Types;

module.exports = model(
	'HOA',
	new Schema(
		{
			hoaId: { type: String, unique: true, required: true },
			name: { type: String, required: [true, 'HOA Name is required'] },
			address: {
				street: {
					type: String,
					required: [true, 'Street is required']
				},
				barangay: {
					type: String,
					required: [true, 'Barangay is required']
				},
				city: { type: String, required: [true, 'City is required'] },
				province: {
					type: String,
					required: [true, 'Province is required']
				}
			},
            deviceIP: String,
			admin: {
				type: ObjectId,
				ref: 'User',
				unique: true,
				required: [true, 'User is required']
			},
			guards: [
				{
					user: {
						type: ObjectId,
						ref: 'User',
						required: [true, 'User is required'],
						index: { unique: true, sparse: true }
					},
					status: {
						type: String,
						enum: ['active', 'retired'],
						default: 'active'
					},
					hiredAt: { type: Date, default: new Date() }
				}
			]
		},
		{ timestamps: true }
	)
);
