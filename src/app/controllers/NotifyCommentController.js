const catchAsync = require('../handler/catchAsync');
const NotifyComment = require('../models/NotifyComment');
const factory = require('./HandlerFactory');
const Response = require('../../utils/response');
const APIFeature = require('../../utils/apiFeature');
// GET api/users/notify-comments
exports.getAllNotifyCommentWithQuery = factory.getAllDocuments(NotifyComment, {
	path: 'commentId',
});

// DELETE api/users/notify-comments/:id/force (commentId)
exports.destroyNotifyComment = catchAsync(async (req, res, next) => {
	const doc = await NotifyComment.deleteOne({ commentId: req.params.id });
	if (!doc) {
		return next(new appError('No document found with that ID', 404));
	}
	Response.basicRequestResult(res, 200, 'Delete notify comment successfully');
});

// GET api/users/notify-comments/me (user / admin)
exports.setIdToGetNotifyComment = catchAsync(async (req, res, next) => {
	req.params.id = req.user._id;
	next();
});
exports.getNotifyCommentById = catchAsync(async (req, res, next) => {
	var notifyComments = await NotifyComment.find({
		// $elemMatch: get match with first query condition
		receiverIds: { $elemMatch: { receiverId: req.params.id } },
	})
		//get first item/value in array match with query condition
		.select({ 'receiverIds.$': 1 })
		.select('updatedAt commentId')
		.populate({
			path: 'commentId',
			select: '-createdAt -updatedAt -__v',
		})
		.sort('-createdAt');
	Response.simpleRequestResult(res, 200, notifyComments);
	// res.status(200).json({ status: 'success', data: notifyComments });
});

// GET api/users/notify-comments/me/:page/:limit (search for paging and limit)
exports.getNotifyCommentByIdSearch = catchAsync(async (req, res, next) => {
	const page = req.params.page * 1 || 1;
	const limit = req.params.limit * 1 || 20;
	const skip = (page - 1) * limit;

	let notifyComments = await NotifyComment.find({
		// $elemMatch: get match with first query condition
		receiverIds: { $elemMatch: { receiverId: req.params.id } },
	})
		//get first item/value in array match with query condition
		.select({ 'receiverIds.$': 1 })
		.select('updatedAt commentId')
		.populate({
			path: 'commentId',
			select: '-createdAt -updatedAt -__v',
		})
		.sort('-createdAt')
		.skip(skip)
		.limit(limit);
	Response.simpleRequestResult(res, 200, notifyComments);
});

// PATCH api/users/notify-comments/:id (id notify comment)
exports.checkReadNotifyComment = catchAsync(async (req, res, next) => {
	var notifyCommentRead = await NotifyComment.findOneAndUpdate(
		{
			_id: req.params.id,
			receiverIds: { $elemMatch: { receiverId: req.user._id } },
		},
		{
			$set: { 'receiverIds.$.readState': true },
		}
	);
	Response.basicRequestResult(res, 200, 'Update successfully');
	// res.status(200).json({ status: 'success', message: 'Update successfully' });
});
