const path = require('path');
const express = require('express');
const morgan = require('morgan');
require('dotenv').config({ path: `${__dirname}/setup.env` });
const app = express();
//help secure cookie(send token) check https
app.enable('trust proxy');
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const methodOverride = require('method-override');
const mainRouter = require('./routes/mainRouter.js');
const database = require('./config/database');
const port = process.env.PORT || 3000;
const appError = require('./app/handler/appError');
const errController = require('./app/handler/ErrorController');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const compression = require('compression');
//import SECURITY Lib
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

//--CATCH-ERROR: uncaughtException have to happening in beginning
process.on('uncaughtException', (err) => {
	console.log(`${'-'.repeat(55)} UNCAUGHT EXCEPTION! 🔥 Shutting down...`);
	console.log(err.name, err.message);
	process.exit(1);
});
//----------------------------------------------------------------

database.connect();
//-----------------CONFIG structure file
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'resources', 'views')); //use join auto join with splash/
app.use(express.static(path.join(__dirname, 'public')));

//-----------------MIDDLEWARE
// Implement CORS
// Access-Control-Allow-Origin * in header: GET, POST
app.use(cors());
//Specific otherDomain use api
//app.use(cors({
// 	origin: 'hppts://www.ortherdomain.com'
// }));
// DELETE, PATCH
app.options('*', cors());
//Only use DELETE, PATCH with below api
//app.options('/api/users/:id', cors());

app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(methodOverride('_method'));

// Body parser, reading data from body into req.body
app.use(express.json()); // you can set express.json({limit: '10kb'})
//parses data from cookie
app.use(cookieParser());
// app.use((req, res, next) => {
//     console.log(req.cookies)
//     next()
// })

// -------------- SECURITY: **(Make sure the body is parsed beforehand)**
// Set security HTTP headers
app.use(helmet());
app.use(
	helmet.contentSecurityPolicy({
		useDefaults: true,
		directives: {
			'script-src': [
				"'self'",
				"'unsafe-eval'",
				"'unsafe-inline'",
				'cdnjs.cloudflare.com',
				'code.jquery.com',
				'ajax.googleapis.com',
				'cdn.jsdelivr.net',
				'kit.fontawesome.com',
				'cdn.socket.io',
			],
			'script-src-attr': ["'self'", "'unsafe-inline'"],
		},
	})
);
// Limit request same IP - have to run before "mainRouter(app)"
const limiter = rateLimit({
	windowMs: 60 * 60 * 1000, // 1h
	max: 100, // limit each IP to 100 request in 1h
	message: 'Too many requests from this IP, please try again in an hour',
});
app.use('/api', limiter);

// Data sanitization against NoSQL query injection: (look at the request body/query/params, and filter signs "$" and ".")
app.use(mongoSanitize());

// Data sanitization against XSS: (clean any user input from malicious HTML code)
app.use(xss());

// prevent parameter pollution (eg. name=a&name=b -> query with name=b)
app.use(hpp());

// COMPRESSION ALL MIDDLEWARE
app.use(compression());

//RUN ROUTER & HANDLE ERR
mainRouter(app);
//error handlers for routers
app.all('*', (req, res, next) => {
	// init class appError and next() to through it errController
	next(new appError(`Can't find ${req.originalUrl}`, 404));
});
app.use(errController);

//LISTEN PORT
server.listen(port, () => {
	console.log(`App running on port: ${port}`);
});
//LISTEN SOCKET IO
app.io = io;
io.on('connection', (socket) => {
	console.log('--- new connect with ID: ' + socket.id + ' ---');
	socket.on('AdminId', (data) => {
		app.socketIdAdmin = socket.id;
	});
});

//error handlers for routers
//---CATCH-ERROR: can't connect to server
process.on('unhandledRejection', (err) => {
	console.log(err.name, err.message);
	console.log('UNHANDLED REJECTION! 🔥 Shutting down...');
	server.close(() => {
		process.exit(1);
	});
});

//SIGTERM  config heroku
process.on('SIGTERM', () => {
	console.log('👋SIGTERM RECEIVED. Shutting down gracefully');
	server.close(() => {
		console.log('👋Process terminated!');
	});
});
