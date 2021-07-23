const Product = require('../models/Product');
const User = require('../models/User');
const Review = require('../models/Review');
const Order = require('../models/Order');

//GET /admin/sing-in
exports.getSingInPage = (req, res, next) => {
	res.status(200).render('singIn');
};

//GET /admin/404
exports.getErrorPage = (req, res, next) => {
	res.status(200).render('errorPage', {
		statusCode: '404',
		title: 'Page not found',
		message: 'Page your are looking for not found!',
	});
};

//GET /admin/new-password/:resetToken
exports.getResetPasswordPage = (req, res, next) => {
	res.status(200).render('resetPassword', { resetToken: req.params.resetToken });
};

//GET /admin/send-email-page
exports.sendEmailPage = (req, res, next) => {
	res.status(200).render('sendEmail');
};

//----------------------------------------------------------------
//GET /admin/statistics
exports.getStatisticsPage = (req, res, next) => {
	res.status(200).render('statisticsPage');
};

//GET /admin/dashboard
exports.getDashboardPage = (req, res, next) => {
	res.status(200).render('dashboard');
};

//GET /admin/my-profile
exports.getProfileAdmin = (req, res, next) => {
	res.status(200).render('profileAdmin', { user: req.user });
};

//------------------------------USER------------------------------
//GET admin/users
exports.getUserOverviewPage = async (req, res, next) => {
	const users = await User.find();
	res.status(200).render('userOverview', { users: users });
};

//------------------------------REVIEW------------------------------
//GET admin/reviews
exports.getReviewOverviewPage = async (req, res, next) => {
	const reviews = await Review.find()
		.populate({
			path: 'productId',
			select: 'name',
		})
		.sort({ createdAt: -1 });
	res.status(200).render('reviewOverview', { reviews: reviews });
};

//-----------------------------PRODUCT-------------------------------
//GET /admin/products
exports.getProductOverviewPage = async (req, res, next) => {
	const products = await Product.find({ outOfStock: false }).sort({ createdAt: -1 });
	res.status(200).render('product/productOverview', { products: products });
};

//GET admin/products/bin
exports.getProductBinOverviewPage = async (req, res, next) => {
	const products = await Product.find({ outOfStock: true }).sort({ createdAt: -1 });
	res.status(200).render('product/productBinOverview', { products: products });
};

//GET /admin/products/create
exports.getCreateProductPage = async (req, res, next) => {
	res.status(200).render('product/createProductPage');
};

//GET /admin/products/:slug
exports.getEditProductPage = async (req, res, next) => {
	const product = await Product.findOne({ slug: req.params.slug });
	res.status(200).render('product/editProductPage', { product: product });
};

// -------------------------------ORDER------------------------------
//GET admin/orders
exports.getOrderOverviewPage = async (req, res, next) => {
	const orders = await Order.find().sort({ createdAt: -1 });
	res.status(200).render('order/orderOverview', { orders: orders });
};
//GET admin/orders/bin
exports.getOrderBinOverviewPage = async (req, res, next) => {
	const orders = await Order.findDeleted().sort({ createdAt: -1 });
	res.status(200).render('order/orderBinOverview', { orders: orders });
};
//GET admin/orders-detail/:id
exports.getOrderDetailPage = async (req, res, next) => {
	const order = await Order.findOne({ _id: req.params.id });
	res.status(200).render('order/orderDetail', { order: order });
};
