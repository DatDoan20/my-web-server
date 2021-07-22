const express = require('express');
const router = express.Router();
const viewController = require('../app/controllers/ViewController');
const orderController = require('../app/controllers/OrderController');
const authController = require('../app/controllers/AuthController');
//
router.get('/sing-in', viewController.getSingInPage);
router.get('/404', viewController.getErrorPage);
//Protect Admin
router.use(authController.protectUsers, authController.restrictTo('admin'));
router.get('/statistics', viewController.getStatisticsPage);
router.get('/dashboard', viewController.getDashboardPage);
router.get('/my-profile', viewController.getProfileAdmin);

//--User
router.get('/users', viewController.getUserOverviewPage);

//--Review
router.get('/reviews', viewController.getReviewOverviewPage);

//--Product
router.get('/products', viewController.getProductOverviewPage);
router.get('/products/bin', viewController.getProductBinOverviewPage);
router.get('/products/create', viewController.getCreateProductPage);
router.get('/products/:slug', viewController.getEditProductPage);

//--Order
router.get('/orders', viewController.getOrderOverviewPage);
router.get('/orders/bin', viewController.getOrderBinOverviewPage);
router.get('/orders-detail/:id', viewController.getOrderDetailPage);
router.get('/orders/send-email/:idOrder/:actionType', orderController.sendEmailInfoOrder);
//DELETE-DESTROY Order ( :id -> orderId)
router.delete('/:id/force', orderController.destroyOrder);
router.delete('/:id/soft', orderController.deleteOrder);

//Restore
router.patch('/orders/restore/:id', orderController.restoreOrder);

//UPDATE(accept sate of order: waiting -> accepted)
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

module.exports = router;
