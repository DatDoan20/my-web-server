const rateLimit = require('express-rate-limit');

const ONE_HOURS = 60 * 60 * 1000;
const LIMIT_100 = 100;
const LIMIT_200 = 200;
const LIMIT_10 = 10;
const LIMIT_5 = 5;

const limiter = (time, limitRequest) => {
	return rateLimit({
		windowMs: time, // 1h
		max: limitRequest, // limit each IP to 100 request in 1h
		message: {
			//return json, this only return: status and message
			status: 'error',
			message: 'Too many requests from this IP, please try again in an hour',
		},
	});
};

function limitRouter(app) {
	app.use('/api/users/update-password', limiter(ONE_HOURS, LIMIT_5));
	app.use('/api/users/forgot-password', limiter(ONE_HOURS, LIMIT_5));
	app.use('/api/users/update-password', limiter(ONE_HOURS, LIMIT_5));

	app.use('/api/users/update-me', limiter(ONE_HOURS, LIMIT_10));
	app.use('/api/users/orders/:id/force', limiter(ONE_HOURS, LIMIT_10));

	app.use('/api/users/orders/me', limiter(ONE_HOURS, LIMIT_100));

	app.use('/api/users/reviews', limiter(ONE_HOURS, LIMIT_200));
	app.use('/api/products/search?', limiter(ONE_HOURS, LIMIT_200));
	app.use('/api/products/:id', limiter(ONE_HOURS, LIMIT_200));
}
module.exports = limitRouter;

// Limit request same IP - have to run before "mainRouter(app)"
// const limiter = rateLimit({
// 	windowMs: 60 * 60 * 1000, // 1h
// 	max: 100, // limit each IP to 100 request in 1h
// 	message: {
// 		//return json, this only return: status and message
// 		status: 'error',
// 		message: 'Too many requests from this IP, please try again in an hour',
// 	},
// });
// app.use('/api', limiter);
