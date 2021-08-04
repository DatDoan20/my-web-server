const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NotifyComment = new Schema(
	{
		commentId: { type: mongoose.Schema.ObjectId, ref: 'Comment', require: true },
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
		// have to begin ahead of timestamps
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
		timestamps: true,
	}
);
//** send comment and show INFO SENDER NOT (RECEIVER) */
module.exports = mongoose.model('NotifyComment', NotifyComment);
