const catchAsync = require('../handler/catchAsync');
const User = require('../models/User');
const appError = require('../handler/appError');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const Email = require('../../utils/email');
const Response = require('../../utils/response');
const crypto = require('crypto');
const factory = require('./HandlerFactory');
//----------------------------------------------------------------
const createToken = (_id) => {
	return jwt.sign({ _id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN,
	});
};
// not want return data -> set undefined -> json will not includes data field
const returnResultOfRequest = (res, statusCode, message, data = undefined) => {
	return Response.basicRequestResult(res, statusCode, message, data);
};
// const returnResultOfRequest = (res, statusCode, message, data = undefined) => {
// 	res.status(statusCode).json({
// 		status: 'success',
// 		message: message,
// 		data: data,
// 	});
// };

const sendToken = (token, req, res) => {
	const cookieOptions = {
		expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
		//not allow any browser to access, modify cookie
		httpOnly: true,
	};
	// if (req.secure || req.headers('x-forwarded-proto') === 'https') {
	// 	// the cookie will only be sent on an encrypted connection. only work in https(production)
	// 	// dont forget set : app.enable('trust proxy'); in server.js
	// 	cookieOptions.secure = true;
	// }
	res.cookie('jwt', token, cookieOptions);
};
//----------------------------------------------------------------
//POST api/users/sing-up
exports.singUp = catchAsync(async (req, res, next) => {
	if (!validator.isMobilePhone(req.body.phone, 'vi-VN')) {
		return next(new appError('Please provide valid phone!', 400));
	}

	const newUser = await User.create(req.body);

	//return res for client
	// const token = createToken(newUser._id);
	// sendToken(token, req, res);
	returnResultOfRequest(
		res,
		201,
		`SingUp successfully with "Phone: ${newUser.phone}" and "Name: ${newUser.name}"`
	);
});
//----------------------------------------------------------------
//POST api/users/sing-in-user or api/users/sing-in-admin
exports.singIn = (roleInput) =>
	catchAsync(async (req, res, next) => {
		const { phone, password } = req.body;
		//
		if (!phone || !password) {
			return next(new appError('Please provide phone or password!'));
		}
		//
		const user = await User.findOne({ phone: phone, role: roleInput });
		if (!user || !(await user.isCorrectPassword(password, user.password))) {
			return next(new appError('Incorrect phone or password!'));
		}
		const token = createToken(user._id);
		sendToken(token, req, res);
		var message = `${user.role}-${user._id}`;
		returnResultOfRequest(res, 200, message, token);
	});
//-----------------------------------------------------------------
//GET api/users/sing-up
exports.singOut = (req, res) => {
	res.cookie('jwt', 'singOut', {
		expires: new Date(Date.now() + 10 * 1000),
		httpOnly: true,
	});
	returnResultOfRequest(res, 200, 'SingOut successfully');
};
//----------------------------------------------------------------
//POST  api/users/forgot-password
exports.forgotPassword = catchAsync(async (req, res, next) => {
	// 1.get user base on posted email
	const user = await User.findOne({ email: req.body.email });
	if (!user) {
		return next(new appError('There is no user with email address', 404));
	}

	//2.generate resetToken(original token), passwordResetToken(encrypted token), passwordResetExpires(time 10m)
	const resetToken = user.createPasswordResetToken();
	await user.save();

	//3.send it to user'email
	try {
		const resetURL = `${req.protocol}://${req.get('host')}/admin/new-password/${resetToken}`;

		await new Email(user, resetURL).sendPasswordReset();

		returnResultOfRequest(res, 200, 'Token sent to email!');
	} catch (err) {
		user.passwordResetToken = undefined;
		user.passwordResetExpires = undefined;
		await user.save();
		return next(new appError(err, 500));
	}
});
//PATCH api/users/reset-password/:resetToken, AFTER forgotPassword, USER CHECK MAIL TO CHANGED PASSWORD -> resetPassword WILL BE CALLED
exports.resetPassword = catchAsync(async (req, res, next) => {
	//1. encrypt token was send
	const hashedToken = crypto.createHash('sha256').update(req.params.resetToken).digest('hex');
	// + check correct: encrypted token that user was send VS encrypted token was stored in DB
	// + time click link reset have to < time expired (+10minute)
	const user = await User.findOne({
		passwordResetToken: hashedToken,
		passwordResetExpires: { $gt: Date.now() },
	});

	if (!user) {
		return next(new appError('Token invalid or has expired', 400));
	}
	// 2. if token hasn't expired, and there is user, set the new password
	//(override user with new password)
	user.password = req.body.password;
	user.passwordResetExpires = undefined;
	user.passwordResetToken = undefined;

	//3 save and (you can send JWT extra),
	// pre('save') method has update "changePasswordAt" property and "crypt new password" already
	await user.save();
	returnResultOfRequest(res, 200, 'Changed password successfully');
});
//----------------------------------------------------------------
// GET api/users/me or api/users/:id
exports.getUser = factory.getOneDocument(User, {
	path: 'cart.infoProduct',
	select: 'name discount imageCover  _id',
});
exports.getMe = (req, res, next) => {
	req.params.id = req.user.id;
	next();
};
// ------------------------------------------------UPDATE PASSWORD AFTER LOGIN FOR USER
//PATCH api/users/update-password
//body consists of :  currentPassword, newPassword
exports.updatePassword = catchAsync(async (req, res, next) => {
	const user = await User.findById(req.user._id);
	//check current password user enter
	if (!(await user.isCorrectPassword(req.body.currentPassword, user.password))) {
		return next(new appError('Your current password is wrong'));
	}
	//update
	user.password = req.body.newPassword;
	await user.save();
	returnResultOfRequest(res, 200, 'Changed password successfully');
});
//----------------------------------------------------------------
//PATCH api/users/update-me
//change info consists of: name, email, birthYear, sex
exports.updateMe = catchAsync(async (req, res, next) => {
	const user = await User.findById(req.user._id);
	user.name = req.body.name;
	user.birthYear = req.body.birthYear;
	user.sex = req.body.sex;
	if (req.file) {
		user.avatar = req.file.filename;
	}
	await user.save();
	returnResultOfRequest(res, 200, 'Update information successfully');
});
//PATCH api/users/update-email
exports.updateEmail = catchAsync(async (req, res, next) => {
	if (!validator.isEmail(req.body.email)) {
		return next(new appError('Please provide valid email address !', 400));
	}
	const user = await User.findById(req.user._id);
	user.email = req.body.email;
	user.stateVerifyEmail = true;
	// console.log(req.body);
	await user.save();

	//send email welcome
	// http://127.0.0.1:3000/admin/sing-in
	await new Email(user, `${req.protocal}://${req.get('host')}/admin/sign-in`).sendWelcome();
	returnResultOfRequest(res, 200, 'Update email successfully', user.email);
});
//----------------------------------------------------------------
//PATCH api/users/add-to-cart
exports.addToCart = catchAsync(async (req, res, next) => {
	let user = req.user;
	const cartItem = req.body;

	//find if product is exist in cart? - "haven't check yet"
	const id = user.cart.findIndex((cartItem) => cartItem.infoProduct == cartItem.infoProduct);
	if (id !== -1) {
		returnResultOfRequest(res, 200, 'Product was added to cart of user', user);
	}

	//product is not exist in cart
	user.cart.push(cartItem);
	await user.save();
	user = await user
		.populate({ path: 'cart.infoProduct', select: 'name discount imageCover  _id' })
		.execPopulate();

	returnResultOfRequest(res, 200, 'Add product to cart of user successfully', user);
});
//PATCH api/users/delete-product-in-cart
exports.deleteProductInCart = catchAsync(async (req, res, next) => {
	let user = req.user;
	const productId = req.body;
	// console.log(user.cart.findIndex((cartItem) => cartItem.infoProduct == productId.id));
	// use == is not care datatype so request is string and datatype in DB is ObjectID
	user.cart.splice(
		user.cart.findIndex((cartItem) => cartItem.infoProduct == productId.id),
		1
	);
	await user.save();
	user = await user
		.populate({ path: 'cart.infoProduct', select: 'name discount imageCover  _id' })
		.execPopulate();

	returnResultOfRequest(res, 200, 'remove product in cart of user successfully', user);
});
//----------------------------------------------------------------
//PATCH api/users/add-to-fav
exports.addToFav = catchAsync(async (req, res, next) => {
	const user = req.user;
	user.favProducts = user.favProducts.concat(req.body.favProducts);
	await user.save();
	returnResultOfRequest(res, 200, 'Add product to favorite list of user successfully', user);
});
//-----------------------------ADMIN-----------------------------------
//only show account user to admin click delete (SOFT DELETE)
exports.deleteUser = factory.softDeleteOneDocument(User);
// (FORCE DELETE)
exports.destroyUser = factory.forceDeleteOneDocument(User);
//----------------------------------------------------------------
