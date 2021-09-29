const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var mongooseDelete = require('mongoose-delete');

const Order = new Schema(
	{
		state: { type: String, default: 'waiting' },
		costDelivery: { type: Number, default: 0 },
		totalPrice: { type: Number, required: true },
		totalPayment: { type: Number, required: true },
		paymentMode: { type: String, enum: ['COD', 'Banking'], default: 'COD' },

		userId: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
		nameUser: { type: String, required: true },
		emailUser: { type: String, required: true },
		phoneUser: { type: String, required: true },
		addressDelivery: { type: String, required: true },
		note: { type: String, default: '' },

		purchasedProducts: [
			new Schema(
				{
					productId: { type: mongoose.Schema.ObjectId, ref: 'Product', required: true },
					imageCover: { type: String, required: true },
					name: { type: String, required: true },
					price: { type: Number, required: true },
					quantity: { type: Number, required: true },
					size: { type: String, required: true },
					color: { type: String, required: true },
					discount: { type: Number, required: true },
					finalPrice: { type: Number, required: true },
					stateRating: { type: Boolean, required: true, default: false },
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
Order.plugin(mongooseDelete, { overrideMethods: true });
Order.plugin(mongooseDelete, { deletedAt: true });

module.exports = mongoose.model('Order', Order);
