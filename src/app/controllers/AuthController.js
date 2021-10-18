const User = require('../models/User');
const jwt = require('jsonwebtoken');
const catchAsync = require('../handler/catchAsync');
const appError = require('../handler/appError');

exports.protectUsers = catchAsync(async (req, res, next) => {
	let token;
	if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
		token = req.headers.authorization.split(' ')[1];
	} else if (req.cookies.jwt) {
		token = req.cookies.jwt;
	}

	// console.log(token)

	if (!token) {
		return next(new appError('You are not login!!!', 401));
	}
	//verify -> here decode if token was expired it throw exception
	const decoded = jwt.verify(token, process.env.JWT_SECRET);
	// console.log(decoded)

	//check if user is exist
	const freshUser = await User.findById(decoded._id);
	if (!freshUser) {
		return next(new appError('user belonging to this token does not exist!!!', 401));
	}

	//check if password of user is changed?
	if (freshUser.changedPasswordAt(decoded.iat)) {
		return next(new appError('user changed password, please login again!!!', 401));
	}
	//everything ok, pass user to next function to user before if need
	req.user = freshUser;
	next();
});

exports.restrictTo = (...roles) => {
	return (req, res, next) => {
		//role admin
		if (!roles.includes(req.user.role)) {
			return next(new appError('You do not have permission to perform this action', 403));
		}
		next();
	};
};
