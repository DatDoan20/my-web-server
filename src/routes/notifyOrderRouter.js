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

//PATCH api/users/notify-orders/:id/read/me
router.patch('/:id/read/me', notifyOrderController.checkReadNotifyOrder);

//PATCH api/users/notify-orders/me/read/all
router.patch('/me/read/all', notifyOrderController.checkReadAllNotifyOrder);

// DELETE api/users/notify-orders/me/all/force
router.delete('/me/all/force', notifyOrderController.destroyAllNotifyOrder);

// DELETE api/users/notify-orders/:id/soft (orderId)
router.delete('/:id/soft', notifyOrderController.deleteNotifyOrder);

// DELETE api/users/notify-orders/:id (notifyCommentId)
router.delete('/:id/force', notifyOrderController.destroyNotifyOrder);

//PATCH (restore notify order ) api/users/notify-orders/restore/:id
router.patch('/restore/:id', notifyOrderController.restoreNotifyOrder);

module.exports = router;
