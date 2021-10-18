const userRouter = require('./userRouter');
const productRouter = require('./productRouter');
const viewRouter = require('./viewRouter');

function route(app) {
	app.use('/admin', viewRouter);
	app.use('/api/users', userRouter);
	app.use('/api/products', productRouter);
}
module.exports = route;
