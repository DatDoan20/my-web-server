const catchAsync = require('../handler/catchAsync');
const Order = require('../models/Order');
const factory = require('./HandlerFactory');
const Email = require('../../utils/email');
// GET /api/orders/search?OrderId
exports.setOrderIdOfUser = catchAsync(async (req, res, next) => {
	if (!req.query.userId) {
		req.query.userId = req.user._id;
	}
	next();
});
exports.getAllOrderWithQuery = factory.getAllDocuments(Order);

//POST /api/orders
exports.createOrder = factory.createOneDocument(Order);
exports.clearCartUser = catchAsync(async (req, res, next) => {
	req.user.cart = [];
	await req.user.save();
	next();
});

// DELETE /api/orders/:id (orderId)
exports.deleteOrder = factory.softDeleteOneDocument(Order);
exports.destroyOrder = factory.forceDeleteOneDocument(Order);
//Restore
exports.restoreOrder = factory.restoreOneDocument(Order);

//UPDATE accept order /api/orders/accept/:id
exports.updateStateOrder = factory.updateOneDocument(Order);
exports.setStateOrder = (stateValue) =>
	catchAsync(async (req, res, next) => {
		req.body.state = stateValue;
		next();
	});

exports.sendEmailInfoOrder = catchAsync(async (req, res, next) => {
	if (req.params.actionType === 'accept') {
		const order = await Order.findOne({ _id: req.params.idOrder });
		const user = {
			name: order.nameUser,
			email: order.emailUser,
		};
		const nameKey = 'order';
		await new Email(user, '', nameKey, order).sendInfoOrder(req.params.actionType);
	} else if (req.params.actionType === 'cancel') {
		const order = await Order.findOneDeleted({ _id: req.params.idOrder });
		console.log(order);
		const user = {
			name: order.nameUser,
			email: order.emailUser,
		};
		const nameKey = 'order';
		await new Email(user, '', nameKey, order).sendInfoOrder(req.params.actionType);
	}
	res.status(200).json({ status: 'success', message: 'email was sent' });
});
