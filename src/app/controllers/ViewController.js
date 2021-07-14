const Product = require('../models/Product');
const User = require('../models/User');
const Review = require('../models/Review');
const Order = require('../models/Order');

exports.getSingInPage = (req, res, next) => {
	res.status(200).render('singIn');
};
exports.getDashboardPage = (req, res, next) => {
	res.status(200).render('dashboard');
};
exports.getErrorPage = (req, res, next) => {
	res.status(200).render('errorPage', {
		statusCode: '404',
		title: 'Page not found',
		message: 'Page your are looking for not found!',
	});
};
exports.getProfileAdmin = (req, res, next) => {
	res.status(200).render('profileAdmin', { user: req.user });
};
exports.getUserOverviewPage = async (req, res, next) => {
	const users = await User.find();
	res.status(200).render('userOverview', { users: users });
};
exports.getReviewOverviewPage = async (req, res, next) => {
	const reviews = await Review.find().populate({
		path: 'productId',
		select: 'name',
	});
	res.status(200).render('reviewOverview', { reviews: reviews });
};
exports.getOrderOverviewPage = async (req, res, next) => {
	const orders = await Order.find();
	res.status(200).render('orderOverview', { orders: orders });
};
//----------------------------------------------------------------
exports.getProductOverviewPage = async (req, res, next) => {
	const products = await Product.find();
	res.status(200).render('productOverview', { products: products });
};

exports.getProductEditPage = async (req, res, next) => {
	const product = await Product.findOne({ slug: req.params.slug });
	res.status(200).render('editProductPage', { product: product });
};
exports.updateProduct = async (req, res, next) => {
	console.log(req.body);
};
