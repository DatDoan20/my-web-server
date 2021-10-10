const express = require('express');
const router = express.Router();
const viewController = require('../app/controllers/ViewController');
const orderController = require('../app/controllers/OrderController');
const authController = require('../app/controllers/AuthController');
const NotifyComment = require('../app/models/NotifyComment');
const Comment = require('../app/models/Comment');
const NotifyOrder = require('../app/models/NotifyOrder');
const Order = require('../app/models/Order');
//
router.get('/sign-in', viewController.getSingInPage);
router.get('/404', viewController.getErrorPage);
router.get('/new-password/:resetToken', viewController.getResetPasswordPage);
router.get('/send-email-page', viewController.sendEmailPage);
//Protect Admin
router.use(authController.protectUsers, authController.restrictTo('admin'));
router.get('/statistics', viewController.getStatisticsPage);
router.get('/dashboard', viewController.getDashboardPage);
router.get('/my-profile', viewController.getProfileAdmin);

//--User
router.get('/users', viewController.getUserOverviewPage);

//--Review
router.get('/reviews', viewController.getReviewOverviewPage);
router.get('/review-detail/:productId', viewController.getReviewDetailPage);

//--Product
router.get('/products', viewController.getProductOverviewPage);
router.get('/products/bin', viewController.getProductBinOverviewPage);
router.get('/products/create', viewController.getCreateProductPage);
router.get('/products/:slug', viewController.getEditProductPage);

//--Order
router.get('/orders', viewController.getOrderOverviewPage);
router.get('/orders/bin', viewController.getOrderBinOverviewPage);
router.get('/orders/:id', viewController.getSpecificOrderPage);
router.get('/orders-detail/:id', viewController.getOrderDetailPage);
//Send Email State Order
router.get('/orders/send-email/:idOrder/:actionType', orderController.sendEmailInfoOrder);
//Delete
router.delete('/:id/force', orderController.destroyOrder);
router.delete('/:id/soft', orderController.deleteOrder);
//Restore
router.patch('/orders/restore/:id', orderController.restoreOrder);
//Update state of order, (create: wait, accept: accept, delete-soft: cancel)
router.patch(
	'/orders/accept/:id',
	orderController.setStateOrder('accepted'),
	orderController.updateStateOrder
);
router.patch(
	'/orders/wait/:id',
	orderController.setStateOrder('waiting'),
	orderController.updateStateOrder
);
router.patch(
	'/orders/cancel/:id',
	orderController.setStateOrder('canceled'),
	orderController.updateStateOrder
);
router.patch(
	'/orders/receive/:id',
	orderController.setStateOrder('received'),
	orderController.updateStateOrder
);

router.delete('/destroy-all-notify-order/programmatically', async (req, res) => {
	const a = await NotifyOrder.deleteMany({});
	res.status(200).json({ status: 'success' });
});
router.delete('/destroy-all-notify-comment/programmatically', async (req, res) => {
	const a = await NotifyComment.deleteMany({});
	res.status(200).json({ status: 'success' });
});
router.delete('/destroy-all-order/programmatically', async (req, res) => {
	const a = await Order.deleteMany({});
	res.status(200).json({ status: 'success' });
});
router.delete('/destroy-all-comment/programmatically', async (req, res) => {
	const a = await Comment.deleteMany({});
	res.status(200).json({ status: 'success' });
});
module.exports = router;
