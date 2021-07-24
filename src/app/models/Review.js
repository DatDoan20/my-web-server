const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Product = require('../models/Product');

const Review = new Schema(
	{
		review: { type: String, require: true, maxLength: 255 },
		rating: { type: Number, min: 1, max: 5, default: 5 },
		images: { type: [String], default: [] },
		productId: { type: mongoose.Schema.ObjectId, ref: 'Product', require: true },
		userId: { type: mongoose.Schema.ObjectId, ref: 'User', require: true },
	},
	{
		// have to begin ahead of timestamps
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
		timestamps: true,
	}
);
Review.virtual('comments', {
	ref: 'Comment',
	foreignField: 'reviewId',
	localField: '_id',
});
Review.index({ productId: 1, userId: 1 }, { unique: true });

//middleware
//get info user who is review
Review.pre(/^find/, function (next) {
	this.populate({
		path: 'userId',
		select: 'name avatar',
	});
	next();
});

Review.statics.calcAverageRatings = async function (productId) {
	const stats = await this.aggregate([
		{
			$match: { productId: productId },
		},
		{
			$group: {
				_id: '$productId',
				nRating: { $sum: 1 },
				avgRating: { $avg: '$rating' },
			},
		},
	]);
	if (stats.length > 0) {
		//update in product. After set new data -> number will be around
		await Product.findByIdAndUpdate(productId, {
			ratingsAverage: stats[0].avgRating,
			ratingsQuantity: stats[0].nRating,
		});
	} else {
		await Product.findByIdAndUpdate(productId, {
			ratingsAverage: 5,
			ratingsQuantity: 1,
		});
	}
};

//---WHEN CREATE REVIEW calculating average ratings
//use "post" not "pre" because at this time 'post' all documents are already saved in Database
Review.post('save', function () {
	//use this.constructor because this before  ReviewModel is exported (line:57) it hasn't middleware
	this.constructor.calcAverageRatings(this.productId);
});

//---WHEN UPDATE AND DELETE REVIEW --
//query middleware only supports for /^find/ and /deleteOne/ Review in collection
Review.pre([/^findOneAnd/, /^delete/], async function (next) {
	this.r = await this.findOne();
	//console.log(this.r); //only use findOne, it's will get document which pre update or delete
	next(); // next is post
});
Review.post([/^findOneAnd/, /^delete/], async function () {
	await this.r.constructor.calcAverageRatings(this.r.productId);
});

// time review update === create -> review has not edit yet, otherwise -> show updatedAt time and : edited
module.exports = mongoose.model('Review', Review);
