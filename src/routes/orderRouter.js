const express = require('express');
const router = express.Router({ mergeParams: true });
const authController = require('../app/controllers/AuthController');
const OrderController = require('../app/controllers/OrderController');

//Protect All User
router.use(authController.protectUsers);

//GET
//api/users/orders/me
router.get('/me', OrderController.setOrderIdOfUser, OrderController.getAllOrderOfMe);
// api/users/orders/search?
router.get('/search', OrderController.getAllOrderWithQuery);

//POST
//api/users/orders
router.post(
	'/',
	OrderController.clearCartUser,
	OrderController.setUserId,
	OrderController.createOrder
);

// DELETE-CANCEL my order
// api/users/orders
router.delete('/:id/force', OrderController.destroyOrder);

module.exports = router;
