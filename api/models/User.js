const { Schema, model } = require('mongoose');

module.exports = model(
	'User',
	new Schema(
		{
			userId: { type: String, unique: true, required: true },
			name: {
				firstName: {
					type: String,
					required: [true, 'First Name is required']
				},
				lastName: {
					type: String,
					required: [true, 'Last Name is required']
				}
			},
			credentials: {
				email: {
					type: String,
					required: [true, 'Email is required'],
					unique: true
				},
				password: {
					type: String,
					required: [true, 'Password is required']
				}
			},
			vehicles: [
				{
					plateNumber: {
						type: String,
						index: { unique: true, sparse: true },
						required: [true, 'Plate Number is required']
					},
					brand: {
						type: String,
						required: [true, 'Brand is required']
					},
					model: {
						type: String,
						required: [true, 'Model is required']
					},
					type: {
						type: String,
						required: [true, 'Type is required']
					},
					color: {
						type: String,
						required: [true, 'Color is required']
					},
                    frontImage: {
                        type: String,
                        required: [true, 'Front Image is required']
                    },
                    backImage: {
                        type: String,
                        required: [true, 'Back Image is required']
                    }
				}
			]
		},
		{
			timestamps: true,
			toJSON: {
				transform: function(doc, ret) {
					delete ret.credentials
					return ret
				}
			}
		}
	)
);
