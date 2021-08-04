const catchAsync = require('../handler/catchAsync');
const NotifyReview = require('../models/NotifyReview');
const factory = require('./HandlerFactory');

// GET api/users/notify-review
exports.getAllNotifyReviewWithQuery = factory.getAllDocuments(NotifyReview, { path: 'reviewId' });

// DELETE api/users/notify-review/:id/force (notifyReviewId)
exports.destroyNotifyReview = factory.forceDeleteOneDocument(NotifyReview);
