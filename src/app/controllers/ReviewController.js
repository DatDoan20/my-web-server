const catchAsync = require('../handler/catchAsync');
const Review = require('../models/Review');
const Order = require('../models/Order');
const factory = require('./HandlerFactory');

// GET /api/reviews/search?productId=... (productId) get all review by one productId
exports.getAllReviewWithQuery = factory.getAllDocuments(Review);

// POST /api/reviews/:productId
exports.setProductIdAndUserId = catchAsync(async (req, res, next) => {
	if (!req.body.productId) {
		req.body.productId = req.params.productId;
	}
	if (!req.body.userId) {
		req.body.userId = req.user._id;
	}
	next();
});
// update product in order -> stateRating:true
exports.updateProductInOrder = catchAsync(async (req, res, next) => {
	const order = await Order.findOne({ _id: req.params.orderId });
	for (const item of order.purchasedProducts) {
		if (item.productId.toString() === req.params.productId) {
			item.stateRating = true;
			break;
		}
	}
	await order.save();
	next();
});
exports.createReview = factory.createOneDocument(Review, 'Review');

// PATCH /api/reviews/:id , only update rating, review
exports.updateReview = factory.updateOneDocument(Review);

// DELETE /api/reviews/:id (reviewId)
exports.destroyReview = factory.forceDeleteOneDocument(Review);
