exports.basicRequestResult = (res, statusCode, message, data = undefined) => {
	res.status(statusCode).json({
		status: 'success',
		message: message,
		data: data,
	});
};
exports.simpleRequestResult = (res, statusCode, data = undefined) => {
	res.status(statusCode).json({ status: 'success', data: data });
};
