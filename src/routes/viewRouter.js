const express = require('express');
const router = express.Router();
const viewController = require('../app/controllers/ViewController');
const authController = require('../app/controllers/AuthController');
router.get('/sing-in', viewController.getSingInPage);

router.get('/404', viewController.getErrorPage);

router.use(authController.protectUsers, authController.restrictTo('admin'));

router.get('/dashboard', viewController.getDashboardPage);
router.get('/users', viewController.getUserOverviewPage);
router.get('/products', viewController.getProductOverviewPage);
router.get('/reviews', viewController.getReviewOverviewPage);
router.get('/orders', viewController.getOrderOverviewPage);
router.get('/my-profile', viewController.getProfileAdmin);
router.get('/products/create', viewController.getCreateProductPage);
router.get('/products/:slug', viewController.getEditProductPage);
module.exports = router;
