const catchAsync = require('../handler/catchAsync')
const Order = require('../models/Order')
const factory = require('./HandlerFactory')

// GET /api/orders/search?OrderId
exports.setOrderIdOfUser = catchAsync( async (req, res, next) => {
	if(!req.query.userId){
		req.query.userId = req.user._id
	}
	next()
})
exports.getAllOrderWithQuery = factory.getAllDocuments(Order)

//POST /api/orders
exports.createOrder = factory.createOneDocument(Order)
exports.clearCartUser = catchAsync( async (req, res, next) => {
	req.user.cart = []
	await req.user.save()
	next()
})

// DELETE /api/reviews/:id (reviewId)
exports.deleteOrder = factory.softDeleteOneDocument(Order)
exports.destroyOrder = factory.forceDeleteOneDocument(Order)
