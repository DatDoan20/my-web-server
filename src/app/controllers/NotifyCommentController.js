const catchAsync = require('../handler/catchAsync');
const NotifyComment = require('../models/NotifyComment');
const factory = require('./HandlerFactory');
const Response = require('../../utils/response');
const APIFeature = require('../../utils/apiFeature');
const User = require('../models/User');
const appError = require('../handler/appError');

// GET api/users/notify-comments
exports.getAllNotifyCommentWithQuery = factory.getAllDocuments(NotifyComment, {
	path: 'commentId',
});

/* DELETE api/users/notify-comments/:id/force (commentId)
 use when delete comment -> delete notify comment -> clear all receiver in*/
exports.destroyNotifyComment = catchAsync(async (req, res, next) => {
	const doc = await NotifyComment.deleteOne({ commentId: req.params.id });
	if (!doc) {
		return next(new appError('No document found with that ID', 404));
	}
	Response.basicRequestResult(res, 200, 'Delete notify comment successfully');
});

// PATCH api/users/notify-comments/:id/remove/me (id notify comment)
exports.deleteMeOutNotifyComment = catchAsync(async (req, res, next) => {
	var notifyCommentRead = await NotifyComment.findOneAndUpdate(
		{
			_id: req.params.id,
			receiverIds: { $elemMatch: { receiverId: req.user._id } },
		},
		{
			$pull: { receiverIds: { receiverId: req.user._id } },
		}
	);
	await destroyOneNotifyCommentIfReceiversEmpty(req.params.id);
	Response.basicRequestResult(res, 200, 'delete successfully');
});
const destroyOneNotifyCommentIfReceiversEmpty = async (idNotifyComment) => {
	const doc = await NotifyComment.deleteOne({
		_id: idNotifyComment,
		receiverIds: { $exists: true, $size: 0 },
	});
};
// PATCH api/users/notify-comments/remove/me/all
exports.deleteMeOutAllNotifyComment = catchAsync(async (req, res, next) => {
	var notifyCommentRead = await NotifyComment.updateMany(
		{
			receiverIds: { $elemMatch: { receiverId: req.user._id } },
		},
		{
			$pull: { receiverIds: { receiverId: req.user._id } },
		}
	);
	await destroyAllNotifyCommentIfReceiversEmpty();
	Response.basicRequestResult(res, 200, 'delete successfully');
});
const destroyAllNotifyCommentIfReceiversEmpty = async () => {
	const doc = await NotifyComment.deleteMany({
		receiverIds: { $exists: true, $size: 0 },
	});
};

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

// PATCH api/users/notify-comments/:id/read/me (id notify comment)
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

// PATCH api/users/notify-comment/me/read/all (body is readAllCommentNoti: now)
exports.checkReadAllNotifyComment = catchAsync(async (req, res, next) => {
	const doc = await User.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true });
	if (!doc) {
		return next(new appError('No document found with that ID', 404));
	}
	Response.basicRequestResult(res, 200, 'Mark as read all successfully');
});
