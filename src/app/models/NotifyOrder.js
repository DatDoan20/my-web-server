const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NotifyOrder = new Schema(
	{
		orderId: { type: mongoose.Schema.ObjectId, ref: 'Order', required: true },
		receiverIds: [
			new Schema(
				{
					receiverId: { type: mongoose.Schema.ObjectId, ref: 'User', require: true },
					readState: { type: Boolean, default: false },
				},
				{ _id: false }
			),
		],
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
		timestamps: true,
	}
);

module.exports = mongoose.model('NotifyOrder', NotifyOrder);
