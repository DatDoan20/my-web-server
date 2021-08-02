const Product = require('../models/Product');
const User = require('../models/User');
const Review = require('../models/Review');
const Order = require('../models/Order');
const catchAsync = require('../handler/catchAsync');
const appError = require('../handler/appError');

//GET /admin/sing-in
exports.getSingInPage = catchAsync(async (req, res, next) => {
	res.status(200).render('singIn');
});

//GET /admin/404
exports.getErrorPage = catchAsync(async (req, res, next) => {
	res.status(200).render('errorPage', {
		statusCode: '404',
		title: 'Page not found',
		message: 'Page your are looking for not found!',
	});
});

//GET /admin/new-password/:resetToken
exports.getResetPasswordPage = catchAsync(async (req, res, next) => {
	res.status(200).render('resetPassword', { resetToken: req.params.resetToken });
});

//GET /admin/send-email-page
exports.sendEmailPage = catchAsync(async (req, res, next) => {
	res.status(200).render('sendEmail');
});

//----------------------------------------------------------------
//GET /admin/statistics
exports.getStatisticsPage = catchAsync(async (req, res, next) => {
	res.status(200).render('statisticsPage', { userAdmin: req.user });
});

//GET /admin/dashboard
exports.getDashboardPage = catchAsync(async (req, res, next) => {
	res.status(200).render('dashboard', { userAdmin: req.user });
});

//GET /admin/my-profile
exports.getProfileAdmin = catchAsync(async (req, res, next) => {
	res.status(200).render('profileAdmin', { user: req.user });
});

//------------------------------USER------------------------------
//GET admin/users
exports.getUserOverviewPage = catchAsync(async (req, res, next) => {
	const users = await User.find();
	res.status(200).render('userOverview', { users: users, userAdmin: req.user });
});

//------------------------------REVIEW------------------------------
//GET admin/reviews
exports.getReviewOverviewPage = catchAsync(async (req, res, next) => {
	const reviews = await Review.find()
		.populate({
			path: 'productId',
			select: 'name _id',
		})
		.sort({ createdAt: -1 });
	res.status(200).render('review/reviewOverview', { reviews: reviews, userAdmin: req.user });
});
exports.getReviewDetailPage = catchAsync(async (req, res, next) => {
	const product = await Product.findOne({ _id: req.params.productId }).populate({
		path: 'reviews',
		select: '-createdAt',
	});
	var statisticsRating = product.reviews.reduce(
		(acc, crr) => {
			switch (crr.rating) {
				case 1:
					acc.one = acc.one + 1;
					break;
				case 2:
					acc.two = acc.two + 1;
					break;
				case 3:
					acc.three = acc.three + 1;
					break;
				case 4:
					acc.four = acc.four + 1;
					break;
				case 5:
					acc.five = acc.five + 1;
					break;
				default:
					break;
			}
			return acc;
		},
		{ five: 0, four: 0, three: 0, two: 0, one: 0 }
	);
	res.status(200).render('review/reviewDetail', {
		product: product,
		avatarAdmin: req.user.avatar,
		statisticsRating: statisticsRating,
	});
	// res.status(200).json({ product: product });
});
//-----------------------------PRODUCT-------------------------------
//GET /admin/products
exports.getProductOverviewPage = catchAsync(async (req, res, next) => {
	const products = await Product.find({ outOfStock: false }).sort({ createdAt: -1 });
	res.status(200).render('product/productOverview', { products: products, userAdmin: req.user });
});

//GET admin/products/bin
exports.getProductBinOverviewPage = catchAsync(async (req, res, next) => {
	const products = await Product.find({ outOfStock: true }).sort({ createdAt: -1 });
	res.status(200).render('product/productBinOverview', {
		products: products,
		userAdmin: req.user,
	});
});

//GET /admin/products/create
exports.getCreateProductPage = catchAsync(async (req, res, next) => {
	res.status(200).render('product/createProductPage');
});
//GET /admin/products/:slug
exports.getEditProductPage = catchAsync(async (req, res, next) => {
	const product = await Product.findOne({ slug: req.params.slug });
	res.status(200).render('product/editProductPage', { product: product });
});

// -------------------------------ORDER------------------------------
//GET admin/orders
exports.getOrderOverviewPage = catchAsync(async (req, res, next) => {
	const orders = await Order.find()
		.populate({ path: 'userId', select: 'avatar name' })
		.sort({ createdAt: -1 });
	res.status(200).render('order/orderOverview', { orders: orders, userAdmin: req.user });
});
//GET admin/orders/bin
exports.getOrderBinOverviewPage = catchAsync(async (req, res, next) => {
	const orders = await Order.findDeleted()
		.populate({ path: 'userId', select: 'avatar name' })
		.sort({ createdAt: -1 });
	res.status(200).render('order/orderBinOverview', { orders: orders, userAdmin: req.user });
});
//GET admin/orders-detail/:id
exports.getOrderDetailPage = catchAsync(async (req, res, next) => {
	const order = await Order.findOne({ _id: req.params.id });
	res.status(200).render('order/orderDetail', { order: order });
});
