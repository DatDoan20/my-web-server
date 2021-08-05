const catchAsync = require('../handler/catchAsync');
const NotifyOrder = require('../models/NotifyOrder');
const factory = require('./HandlerFactory');

// GET api/users/notify-orders
exports.getAllNotifyOrderWithQuery = factory.getAllDocuments(NotifyOrder, {
	path: 'orderId',
});

// DELETE api/users/notify-orders/:id/force (notifyReviewId)
exports.destroyNotifyOrder = factory.forceDeleteOneDocument(NotifyOrder);

// GET api/users/notify-orders/me (user / admin)
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
	res.status(200).json({ status: 'success', data: notifyOrders });
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
	res.status(200).json({ status: 'success', data: notifyOrderRead });
});
