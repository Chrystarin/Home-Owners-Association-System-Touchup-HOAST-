const { Schema, model } = require('mongoose');
const { ObjectId } = Schema.Types;

module.exports = model(
	'Due',
	new Schema(
		{
			dueId: { type: String, unique: true, required: true },
			home: { type: ObjectId, ref: 'Home', required: [true, 'Home id is required'] },
			amount: { type: Number, required: [true, 'Amount is required'] },
			months: { type: Date, required: [true, 'Months is required'] },
			from: { type: Date, required: [true, 'Paid from is required'] },
			to: { type: Date, required: [true, 'Paid to is required'] }
		},
		{ timestamps: true }
	)
);
