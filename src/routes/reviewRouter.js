const express = require('express');
const router = express.Router({ mergeParams: true }); // review param from another router
const authController = require('../app/controllers/AuthController');
const reviewController = require('../app/controllers/ReviewController');
const commentController = require('../app/controllers/CommentController');

// Protect all routes after this middleware
router.use(authController.protectUsers);

//GET users/reviews/search?productId=...
router.get('/search', reviewController.getAllReviewWithQuery);

//POST
router.post('/:productId', reviewController.setProductIdAndUserId, reviewController.createReview);

//PATCH
router.patch('/:id', reviewController.updateReview);

//---------------------------------comments of review-------------------------------
//user/reviews/:id/comment
router.post('/:id/comment', commentController.setCommentInfo, commentController.createComment);
router.delete('/comment/:id/force', commentController.deleteComment);
router.get('/comments', commentController.getComments);
router.use(authController.restrictTo('admin'));
//DELETE :id (reviewId)
router.delete('/:id', reviewController.destroyReview);

module.exports = router;
