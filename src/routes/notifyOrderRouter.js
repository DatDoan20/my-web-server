const express = require('express');
const router = express.Router({ mergeParams: true }); // review param from another router
const authController = require('../app/controllers/AuthController');
const notifyOrderController = require('../app/controllers/NotifyOrderController');

router.use(authController.protectUsers);

// GET api/users/notify-orders/search?
router.get('/search', notifyOrderController.getAllNotifyOrderWithQuery);

//GET api/users/notify-orders/me
router.get(
	'/me',
	notifyOrderController.setIdToGetNotifyOrder,
	notifyOrderController.getNotifyOrderById
);

//PATCH api/users/notify-orders/:id
router.patch('/:id', notifyOrderController.checkReadNotifyOrder);

// DELETE api/users/notify-orders/:id/soft (orderId)
router.delete('/:id/soft', notifyOrderController.deleteNotifyOrder);

//PATCH (restore notify order ) api/users/notify-orders/restore/:id
router.patch('/restore/:id', notifyOrderController.restoreNotifyOrder);

// DELETE api/users/notify-orders/:id (notifyCommentId)
router.delete('/:id/force', notifyOrderController.destroyNotifyOrder);

module.exports = router;
