const express = require('express');
const router = express.Router({ mergeParams: true }); // review param from another router
const authController = require('../app/controllers/AuthController');
const notifyOrderController = require('../app/controllers/NotifyOrderController');

router.use(authController.protectUsers);

// GET api/users/notify-orders/search?
router.get('/search', notifyOrderController.getAllNotifyOrderWithQuery);

//GET api/users/notify-orders/me
router.get('/me', notifyOrderController.setIdUserToParam, notifyOrderController.getNotifyOrderById);
// GET api/users/notify-orders/me/limit/:limit/page/:page (user / admin)
router.get(
	'/me/limit/:limit/page/:page',
	notifyOrderController.setIdUserToParam,
	notifyOrderController.getNotifyOrderByIdSearch
);
//PATCH api/users/notify-orders/:id
router.patch('/:id', notifyOrderController.checkReadNotifyOrder);

//PATCH api/users/notify-orders/me/all
router.patch(
	'/me/all',
	notifyOrderController.setIdUserToParam,
	notifyOrderController.checkReadAllNotifyOrder
);

// DELETE api/users/notify-orders/me/all/force
router.delete('/me/all/force', notifyOrderController.deleteAllNotifyOrder);

// DELETE api/users/notify-orders/:id/soft (orderId)
router.delete('/:id/soft', notifyOrderController.deleteNotifyOrder);

//PATCH (restore notify order ) api/users/notify-orders/restore/:id
router.patch('/restore/:id', notifyOrderController.restoreNotifyOrder);

// DELETE api/users/notify-orders/:id (notifyCommentId)
router.delete('/:id/force', notifyOrderController.destroyNotifyOrder);

module.exports = router;
