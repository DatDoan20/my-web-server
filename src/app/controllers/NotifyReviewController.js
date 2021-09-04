const catchAsync = require('../handler/catchAsync');
const NotifyReview = require('../models/NotifyReview');
const factory = require('./HandlerFactory');
const Response = require('../../utils/response');

// GET api/users/notify-reviews
exports.getAllNotifyReviewWithQuery = factory.getAllDocuments(NotifyReview, { path: 'reviewId' });

// DELETE api/users/notify-reviews/:id/force (notifyReviewId)
exports.destroyNotifyReview = factory.forceDeleteOneDocument(NotifyReview);

// PATCH api/users/notify-reviews/:id (id notify review)
exports.checkReadNotifyReview = catchAsync(async (req, res, next) => {
	var notifyReviewRead = await NotifyReview.findOneAndUpdate(
		{
			_id: req.params.id,
		},
		{
			readState: true,
		}
	);
	Response.basicRequestResult(res, 200, 'Update successfully');
	// res.status(200).json({ status: 'success', message: 'Update successfully' });
});
