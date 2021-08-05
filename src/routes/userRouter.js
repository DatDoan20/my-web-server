const express = require('express');
const router = express.Router();
const userController = require('../app/controllers/UserController');
const authController = require('../app/controllers/AuthController');
const reviewRouter = require('./reviewRouter');
const orderRouter = require('./orderRouter');
const notifyReviewRouter = require('./notifyReviewRouter');
const notifyCommentRouter = require('./notifyCommentRouter');
const notifyOrderRouter = require('./notifyOrderRouter');
const handleImg = require('../app/controllers/HandlerImage');
//
router.post('/sign-up', userController.singUp);
router.post('/sign-in-user', userController.singIn('user'));
router.post('/sign-in-admin', userController.singIn('admin'));
router.get('/sign-out', userController.singOut);

router.post('/forgot-password', userController.forgotPassword);
router.patch('/reset-password/:resetToken', userController.resetPassword);

// Protect all routes
router.use(authController.protectUsers);

router.get('/me', userController.getMe, userController.getUser);
router.get('/:id', userController.getUser);
router.patch('/update-password', userController.updatePassword);
router.patch('/update-me', handleImg.uploadImage, handleImg.resizeImage, userController.updateMe);
router.patch('/add-to-cart', userController.addToCart);
router.patch('/add-to-fav', userController.addToFav);

// api/users/review
router.use('/reviews', reviewRouter);
// api/users/orders
router.use('/orders', orderRouter);

// api/users/notify-comments (user have permission receive notify comment)
router.use('/notify-comments', notifyCommentRouter);
// api/users/notify-orders
router.use('/notify-orders', notifyOrderRouter);

// RestrictTo admin
router.use(authController.restrictTo('admin'));
router.delete('/:id', userController.deleteUser);
router.delete('/:id/force', userController.destroyUser);

// api/users/notify-reviews
router.use('/notify-reviews', notifyReviewRouter);

module.exports = router;
