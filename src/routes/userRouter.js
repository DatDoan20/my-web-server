const express = require('express');
const router = express.Router();
const userController = require('../app/controllers/UserController');
const authController = require('../app/controllers/AuthController');
const reviewRouter = require('./reviewRouter');
const orderRouter = require('./orderRouter');
const handlerImage = require('../app/controllers/handlerImage');
//
router.post('/sing-up', userController.singUp);
router.get('/sing-out', userController.singOut);
router.post('/sing-in-user', userController.singIn('user'));
router.post('/sing-in-admin', userController.singIn('admin'));

router.post('/forgot-password', userController.forgotPassword);
router.patch('/reset-password/:token', userController.resetPassword);

// Protect all routes
router.use(authController.protectUsers);

router.get('/me', userController.getMe, userController.getUser);
router.get('/:id', userController.getUser);

router.patch('/update-password', userController.updatePassword);
router.patch(
	'/update-me',
	handlerImage.uploadImage,
	handlerImage.resizeImage,
	userController.updateMe
);

router.patch('/add-to-cart', userController.addToCart);
router.patch('/add-to-fav', userController.addToFav);

// api/users/review
router.use('/reviews', reviewRouter);
router.use('/orders', orderRouter);
// RestrictTo admin
router.use(authController.restrictTo('admin'));

router.delete('/:id', userController.deleteUser);
router.delete('/:id/force', userController.destroyUser);

module.exports = router;
