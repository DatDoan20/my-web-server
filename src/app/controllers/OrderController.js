const catchAsync = require('../handler/catchAsync');
const Order = require('../models/Order');
const factory = require('./HandlerFactory');
const Email = require('../../utils/email');

// GET /api/orders/me (query to get all order of current user)
exports.setOrderIdOfUser = catchAsync(async (req, res, next) => {
	if (!req.query.userId) {
		req.query.userId = req.user._id;
	}
	next();
});
exports.getAllOrderWithQuery = factory.getAllDocuments(Order);

//POST /api/orders
exports.clearCartUser = catchAsync(async (req, res, next) => {
	req.user.cart = [];
	await req.user.save();
	next();
});
exports.createOrder = factory.createOneDocument(Order);

//---------------------------ADMIN-------------------------------------
//DELETE admin/:id/force
exports.destroyOrder = factory.forceDeleteOneDocument(Order);
// DELETE /api/orders/:id (orderId)
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
		// console.log(order);
		const user = {
			name: order.nameUser,
			email: order.emailUser,
		};
		const nameKey = 'order';
		await new Email(user, '', nameKey, order).sendInfoOrder(req.params.actionType);
	}
	res.status(200).json({ status: 'success', message: 'email was sent' });
});
