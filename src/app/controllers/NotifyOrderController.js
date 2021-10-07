const catchAsync = require('../handler/catchAsync');
const NotifyOrder = require('../models/NotifyOrder');
const factory = require('./HandlerFactory');
const Response = require('../../utils/response');

// GET api/users/notify-orders
exports.getAllNotifyOrderWithQuery = factory.getAllDocuments(NotifyOrder, {
	path: 'orderId',
});

// DELETE api/users/notify-orders/:id/force (notifyOrderId)
exports.destroyNotifyOrder = factory.forceDeleteOneDocument(NotifyOrder);

// DELETE api/users/notify-orders/:id/soft (orderId)
exports.deleteNotifyOrder = catchAsync(async (req, res, next) => {
	const doc = await NotifyOrder.delete({ orderId: req.params.id });
	if (!doc) {
		return next(new appError('No document found with that ID', 404));
	}
	Response.basicRequestResult(res, 200, 'Delete notify order successfully');
});
// PATCH api/users/notify-orders/restore/:id
exports.restoreNotifyOrder = catchAsync(async (req, res, next) => {
	const doc = await NotifyOrder.restore({ orderId: req.params.id });
	if (!doc) {
		return next(new appError('No document found with that ID', 404));
	}
	Response.basicRequestResult(res, 200, 'Restore notify order successfully');
});

// GET api/users/notify-orders/me (admin)
exports.setIdToGetNotifyOrder = catchAsync(async (req, res, next) => {
	req.params.id = req.user._id;
	next();
});
exports.getNotifyOrderById = catchAsync(async (req, res, next) => {
	var notifyOrders = await NotifyOrder.find({
		// $elemMatch: get match with first query condition
		receiverIds: { $elemMatch: { receiverId: req.params.id } },
	})
		//get first item/value in array match with query condition
		.select({ 'receiverIds.$': 1 })
		.select('updatedAt orderId')
		.populate({
			path: 'orderId',
			select: '-createdAt -updatedAt -__v',
			populate: { path: 'userId', select: 'name avatar' },
		})
		.sort('-updatedAt');
	Response.simpleRequestResult(res, 200, notifyOrders);
});
// GET api/users/notify-orders/me/limit/:limit/page/:page (user)
exports.getNotifyOrderByIdSearch = catchAsync(async (req, res, next) => {
	const page = req.params.page * 1 || 1;
	const limit = req.params.limit * 1 || 20;
	const skip = (page - 1) * limit;
	var notifyOrders = await NotifyOrder.find({
		// $elemMatch: get match with first query condition
		receiverIds: { $elemMatch: { receiverId: req.params.id } },
	})
		//get first item/value in array match with query condition
		.select({ 'receiverIds.$': 1 })
		.select('updatedAt state totalPayment')
		.sort('-updatedAt')
		.skip(skip)
		.limit(limit);
	Response.simpleRequestResult(res, 200, notifyOrders);
});

// PATCH api/users/notify-orders/:id (id notify order)
exports.checkReadNotifyOrder = catchAsync(async (req, res, next) => {
	var notifyOrderRead = await NotifyOrder.findOneAndUpdate(
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
