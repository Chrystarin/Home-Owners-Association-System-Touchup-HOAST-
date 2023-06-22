const { Schema, model } = require('mongoose');
const { ObjectId } = Schema.Types;

module.exports = model(
	'Log',
	new Schema(
		{
			logId: { type: String, unique: true, required: true },
			hoa: { type: ObjectId, ref: 'HOA', required: [true, 'HOA is required'] },
			logType: {
				type: String,
				enum: ['user', 'vehicle', 'visitor'],
				required: [true, 'Log Type is required']
			},
			objectId: { type: String, required: [true, 'Object ID is required'] }
		},
		{ timestamps: true }
	)
);
