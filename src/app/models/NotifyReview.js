const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NotifyReview = new Schema(
	{
		readState: { type: Boolean, default: false },
		reviewId: { type: mongoose.Schema.ObjectId, ref: 'Review', require: true },
		receiverId: { type: mongoose.Schema.ObjectId, ref: 'User', require: true }, // (AdminId)
	},
	{
		// have to begin ahead of timestamps
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
		timestamps: true,
	}
);

NotifyReview.index({ adminId: 1 });
//** send review and Admin will get it, show INFO SENDER NOT ADMIN(RECEIVER) */
// time review update === create -> review has not edit yet, otherwise -> show updatedAt time and : edited
module.exports = mongoose.model('NotifyReview', NotifyReview);
