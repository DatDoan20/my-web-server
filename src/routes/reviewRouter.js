const express = require('express')
const router = express.Router({ mergeParams: true })  // review param from another router
const authController = require('../app/controllers/AuthController')
const reviewController = require('../app/controllers/ReviewController')

// Protect all routes after this middleware
router.use(authController.protectUsers)

//GET users/reviews/search?productId=...
router.get('/search', reviewController.getAllReviewWithQuery)

//POST 
router.post('/:productId', reviewController.setProductIdAndUserId, reviewController.createReview)

//PATCH 
router.patch('/:id', reviewController.updateReview)


router.use(authController.restrictTo('admin'))
//DELETE :id (reviewId)
router.delete('/:id', reviewController.destroyReview)



module.exports = router

