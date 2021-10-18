const express = require('express');
const router = express.Router();
const productController = require('../app/controllers/ProductController');
const authController = require('../app/controllers/AuthController');
const reviewController = require('../app/controllers/ReviewController');
const handleImg = require('../app/controllers/HandlerImage');
// Protect all routes after this middleware
router.use(authController.protectUsers);

// get all products
router.get('/search', productController.getAllProductWithQuery);

// get one product
router.get('/:id', productController.getOneProduct);

// RestrictTo admin after this middleware
router.use(authController.restrictTo('admin'));

// create product api/products/ create
router.post('/', productController.createProduct);

// update product api/products/:id
router.patch(
	'/:id',
	handleImg.uploadImages,
	handleImg.resizeImages,
	productController.updateProduct
);

//delete product
router.delete(
	'/:id',
	productController.setOutOfStockProduct(true),
	productController.updateProduct
);
//delete force product + delete all file img of that product
router.delete('/:id/force', handleImg.deleteFileImg, productController.destroyProduct);
//
router.patch(
	'/restore/:id',
	productController.setOutOfStockProduct(false),
	productController.updateProduct
);
module.exports = router;
