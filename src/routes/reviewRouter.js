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
// api/users/reviews/:id(reviewId)/comment
router.post('/:id/comment', commentController.setCommentInfo, commentController.createComment);

//delete force
router.delete('/comment/:id/force', commentController.deleteComment);
//get comment of review  user/reviews/comments
router.get('/comments/search', commentController.getComments);

//------ADMIN
router.use(authController.restrictTo('admin'));
//DELETE :id (reviewId)
router.delete('/:id', reviewController.destroyReview);

module.exports = router;
