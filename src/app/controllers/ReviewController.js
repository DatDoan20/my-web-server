const catchAsync = require('../handler/catchAsync');
const Review = require('../models/Review');
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
exports.createReview = factory.createOneDocument(Review);

// DELETE /api/reviews/:id (reviewId)
exports.destroyReview = factory.forceDeleteOneDocument(Review);

// PATCH /api/reviews/:id , only update rating, review
exports.updateReview = factory.updateOneDocument(Review);
