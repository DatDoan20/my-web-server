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
//GET api/users/notify-comments/me/limit/:limit/page/:page
router.get(
	'/me/limit/:limit/page/:page',
	notifyCommentController.setIdToGetNotifyComment,
	notifyCommentController.getNotifyCommentByIdSearch
);

//PATCH api/users/notify-comments/:id/read/me
router.patch('/:id/read/me', notifyCommentController.checkReadNotifyComment);

// PATCH api/users/notify-comments/me/read/all (body is readAllCommentNoti: now)
router.patch('/me/read/all', notifyCommentController.checkReadAllNotifyComment);

// PATCH api/users/notify-comments/:id/remove/me (id notify comment)
router.patch('/:id/remove/me', notifyCommentController.deleteMeOutNotifyComment);

// PATCH api/users/notify-comments/remove/me/all
router.patch('/remove/me/all', notifyCommentController.deleteMeOutAllNotifyComment);

// DELETE api/users/notify-comments/:id/force (commentId)
router.delete('/:id/force', notifyCommentController.destroyNotifyComment);

module.exports = router;
