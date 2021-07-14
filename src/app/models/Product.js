const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slug = require('mongoose-slug-generator');
var mongooseDelete = require('mongoose-delete');

const Product = new Schema(
	{
		name: { type: String, maxLength: 255, unique: true, required: true },
		description: { type: String, maxLength: 600, required: true },
		images: { type: [String], required: true },
		imageCover: { type: String, required: true },
		slug: { type: String, slug: 'name', unique: true },
		price: { type: Number, required: true },
		brand: { type: String, required: true },
		size: { type: [String], required: true },
		color: { type: [String], required: true },
		material: { type: String, required: true },
		pattern: { type: String, required: true },
		discount: { type: Number, default: 0 },
		outOfStock: { type: Boolean, default: false },
		type: { type: String, required: true },
		category: { type: String, required: true },
		ratingsAverage: {
			type: Number,
			default: 5,
			min: 1,
			max: 5,
			//4.555 -> 45.55 -> 46 -> 4.6
			set: (val) => Math.round(val * 10) / 10,
		},
		ratingsQuantity: { type: Number, default: 1 },
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
		timestamps: true,
	}
);
//Virtual populate
//get list review of particular product
Product.virtual('reviews', {
	ref: 'Review',
	foreignField: 'productId',
	localField: '_id',
});

Product.plugin(mongooseDelete, { overrideMethods: true });
Product.plugin(mongooseDelete, { deletedAt: true });
mongoose.plugin(slug);

//lowercase_abc_abc -> self understand in database
module.exports = mongoose.model('Product', Product);
