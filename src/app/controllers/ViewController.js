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
exports.getStatisticsPage = (req, res, next) => {
	res.status(200).render('statisticsPage');
};
//
exports.getUserOverviewPage = async (req, res, next) => {
	const users = await User.find();
	res.status(200).render('userOverview', { users: users });
};
exports.getReviewOverviewPage = async (req, res, next) => {
	const reviews = await Review.find()
		.populate({
			path: 'productId',
			select: 'name',
		})
		.sort({ createdAt: -1 });
	res.status(200).render('reviewOverview', { reviews: reviews });
};
// -------------------------------Order
exports.getOrderOverviewPage = async (req, res, next) => {
	const orders = await Order.find().sort({ createdAt: -1 });
	res.status(200).render('order/orderOverview', { orders: orders });
};
exports.getOrderBinOverviewPage = async (req, res, next) => {
	const orders = await Order.findDeleted().sort({ createdAt: -1 });
	res.status(200).render('order/orderBinOverview', { orders: orders });
};
exports.getTest = async (req, res, next) => {
	res.status(200).render('order/orderOverview2');
};
//-----------------------Product-----------------------------------------
exports.getProductOverviewPage = async (req, res, next) => {
	const products = await Product.find({ outOfStock: false }).sort({ createdAt: -1 });
	res.status(200).render('product/productOverview', { products: products });
};
exports.getProductBinOverviewPage = async (req, res, next) => {
	const products = await Product.find({ outOfStock: true }).sort({ createdAt: -1 });
	res.status(200).render('product/productBinOverview', { products: products });
};

exports.getEditProductPage = async (req, res, next) => {
	const product = await Product.findOne({ slug: req.params.slug });
	res.status(200).render('product/editProductPage', { product: product });
};
exports.getCreateProductPage = async (req, res, next) => {
	res.status(200).render('product/createProductPage');
};
