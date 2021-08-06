const express = require('express');
const router = express.Router({ mergeParams: true }); // review param from another router
const authController = require('../app/controllers/AuthController');
const notifyReviewController = require('../app/controllers/NotifyReviewController');

router.use(authController.protectUsers);

// GET api/users/notify-reviews
router.get('/search', notifyReviewController.getAllNotifyReviewWithQuery);

// DELETE api/users/notify-reviews/:id (notifyReviewId)
router.delete('/:id/force', notifyReviewController.destroyNotifyReview);

// PATCH api/users/notify-reviews/:id (id notify review)
router.patch('/:id', notifyReviewController.checkReadNotifyReview);
module.exports = router;
