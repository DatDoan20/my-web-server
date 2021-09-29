const express = require('express');
const router = express.Router({ mergeParams: true }); // review param from another router
const authController = require('../app/controllers/AuthController');
const notifyCommentController = require('../app/controllers/NotifyCommentController');

router.use(authController.protectUsers);

// GET api/users/notify-comments/search?
router.get('/search', notifyCommentController.getAllNotifyCommentWithQuery);

//GET api/users/notify-comments/me
router.get(
	'/me',
	notifyCommentController.setIdToGetNotifyComment,
	notifyCommentController.getNotifyCommentById
);
//GET api/users/notify-comments/me/search?
router.get(
	'/me/page/:page/limit/:limit',
	notifyCommentController.setIdToGetNotifyComment,
	notifyCommentController.getNotifyCommentByIdSearch
);

//PATCH api/users/notify-comments/:id
router.patch('/:id', notifyCommentController.checkReadNotifyComment);

// DELETE api/users/notify-comments/:id/force (commentId)
router.delete('/:id/force', notifyCommentController.destroyNotifyComment);

module.exports = router;
