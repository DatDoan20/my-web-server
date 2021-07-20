const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Comment = new Schema(
	{
		reviewId: { type: mongoose.Schema.ObjectId, ref: 'Review', require: true },
		userId: { type: mongoose.Schema.ObjectId, ref: 'User', require: true },
		comment: { type: String, require: true, maxLength: 255 },
	},
	{
		// have to begin ahead of timestamps
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
		timestamps: true,
	}
);
Comment.pre(/^find/, function (next) {
	this.populate({
		path: 'userId',
		select: 'name avatar',
	});
	next();
});
module.exports = mongoose.model('Comment', Comment);
