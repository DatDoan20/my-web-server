const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var mongooseDelete = require('mongoose-delete');

const NotifyOrder = new Schema(
	{
		//orderId to ref Order to get info show admin side, user not populate orderId here
		orderId: { type: mongoose.Schema.ObjectId, ref: 'Order', required: true },

		//state here to show client side when order was changed state,
		state: { type: String },
		totalPayment: { type: Number },

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
NotifyOrder.plugin(mongooseDelete, { overrideMethods: true });
NotifyOrder.plugin(mongooseDelete, { deletedAt: true });

module.exports = mongoose.model('NotifyOrder', NotifyOrder);
