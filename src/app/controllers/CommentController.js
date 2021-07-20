const catchAsync = require('../handler/catchAsync');
const Comment = require('../models/Comment');
const factory = require('./HandlerFactory');

exports.createComment = factory.createOneDocument(Comment);
exports.setCommentInfo = (req, res, next) => {
	req.body.userId = req.user._id;
	req.body.reviewId = req.params.id;
	next();
};
exports.deleteComment = factory.forceDeleteOneDocument(Comment);
exports.getComments = factory.getAllDocuments(Comment);
