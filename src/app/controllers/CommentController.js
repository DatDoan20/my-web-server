const catchAsync = require('../handler/catchAsync');
const Comment = require('../models/Comment');
const factory = require('./HandlerFactory');

//POST api/users/reviews/:id/comment
exports.setCommentInfo = (req, res, next) => {
	req.body.userId = req.user._id;
	req.body.reviewId = req.params.id;
	next();
};
exports.createComment = factory.createOneDocument(Comment, 'Comment');

//DELETE api/users/reviews/comment/:id/force
exports.deleteComment = factory.forceDeleteOneDocument(Comment);

// GET api/users/reviews/comments
exports.getComments = factory.getAllDocuments(Comment);
