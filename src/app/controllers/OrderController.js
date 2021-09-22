const catchAsync = require('../handler/catchAsync');
const Order = require('../models/Order');
const factory = require('./HandlerFactory');
const Email = require('../../utils/email');
const NotifyOrder = require('../models/NotifyOrder');

const Response = require('../../utils/response');

// GET /api/orders/me (query to get all order of current user)
exports.setOrderIdOfUser = catchAsync(async (req, res, next) => {
	if (!req.query.userId) {
		req.query.userId = req.user._id;
	}
	next();
});
exports.getAllOrderOfMe = factory.getAllDocuments(Order);
exports.getAllOrderWithQuery = factory.getAllDocuments(Order, {
	path: 'userId',
	select: 'name avatar',
});

//POST /api/orders
exports.clearCartUser = catchAsync(async (req, res, next) => {
	req.user.cart = [];
	await req.user.save();
	next();
});
exports.setUserId = catchAsync(async (req, res, next) => {
	req.body.userId = req.user._id;
	next();
});
exports.createOrder = factory.createOneDocument(Order, 'Order');

//---------------------------ADMIN-------------------------------------
/*	DELETE admin/:id/force  (admin delete force) || 
 	api/users/orders/:id/force (user can delete force if that order has not been accepted, constraint client side )*/
exports.destroyOrder = catchAsync(async (req, res, next) => {
	// delete force order
	const order = await Order.deleteOne({ _id: req.params.id });
	if (!order) {
		return next(new appError('No document found with that ID', 404));
	}
	// delete force notifyOrder
	const notifyOrder = await NotifyOrder.deleteOne({ orderId: req.params.id });
	Response.basicRequestResult(res, 200, 'Delete successfully');
});

// DELETE admin/:id/soft (user delete)
exports.deleteOrder = factory.softDeleteOneDocument(Order);

//PATCH admin/orders/restore/:id
exports.restoreOrder = factory.restoreOneDocument(Order);

//PATCH accept order /api/orders/accept/:id
exports.setStateOrder = (stateValue) =>
	catchAsync(async (req, res, next) => {
		req.body.state = stateValue;
		next();
	});
exports.updateStateOrder = factory.updateOneDocument(Order);

//GET	admin/orders/send-email/:idOrder/:actionType
exports.sendEmailInfoOrder = catchAsync(async (req, res, next) => {
	var resultSendEmail;
	if (req.params.actionType === 'accept') {
		const order = await Order.findOne({ _id: req.params.idOrder });
		const user = {
			name: order.nameUser,
			email: order.emailUser,
		};
		const nameKey = 'order';
		resultSendEmail = await new Email(user, '', nameKey, order).sendInfoOrder(
			req.params.actionType
		);
	} else if (req.params.actionType === 'cancel') {
		const order = await Order.findOneDeleted({ _id: req.params.idOrder });
		// console.log(order);
		const user = {
			name: order.nameUser,
			email: order.emailUser,
		};
		const nameKey = 'order';
		resultSendEmail = await new Email(user, '', nameKey, order).sendInfoOrder(
			req.params.actionType
		);
	}
	if (resultSendEmail) {
		Response.basicRequestResult(res, 200, 'email was sent');
		// res.status(200).json({ status: 'success', message: 'email was sent' });
	} else {
		Response.basicRequestResultErr(res, 200, 'send email failed');
		// res.status(500).json({ status: 'error', message: 'send email failed' });
	}
});
