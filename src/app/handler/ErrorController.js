const appError = require('./appError')
//----------------
const sendErrorDev = (err,req, res) => {
	//API
	//if(req.originalUrl.startsWith('/api')){
		return res.status(err.statusCode).json({
			status: err.status,
			message: err.message,
			error: err,
			stack: err.stack
		})
	//}	
	//RENDER WEBSITE
	return res.status(err.statusCode).render('errorPage', {
		statusCode: err.statusCode,
		title: 'Something went wrong!',
		message: err.message
	})
}
const sendErrorProd = (err,req, res) => {
	// API
	if(req.originalUrl.startsWith('/api')){ 
		//trusted error
		if(err.isOperational){
			return res.status(err.statusCode).json({
				status: err.status,
				message: err.message
			})
		}
		//generic error
		console.error(`${'-'.repeat(55)}ERROR 🔥`, err)
		return res.status(500).json({
			status: 'error',
			message: 'Something went very wrong!'
		})
		
	} 
	// RENDER WEBSITE
	// trusted error
	if(err.isOperational){
		return res.status(err.statusCode).render('errorPage',{
			statusCode: err.statusCode,
			title: 'Something went wrong!',
			message: err.message
		})
	}
	// generic error
	return res.status(err.statusCode).render('errorPage',{
		statusCode: err.statusCode,
		title: 'Something went wrong!',
		msg: 'Please try again later'
	})
}

//error: type data
const handleCastErrorDB = err => {
	const message =  `Invalid ${err.path}: ${err.value}`
	return new appError(message, 400) 

}

//error: duplicate field in document of collection
handleDuplicateFieldsDB = err => {
	const value = err.message.match(/(["'])(\\?.)*?\1/)
	const message =  `Duplicate field value ${value}:, Please use another value!` 
	return new appError(message, 400)
}

//error: ValidationError
handleValidationErrorDB  = err => {
	const errors = Object.values(err.errors).map(el => el.message)
	const message =  `Invalid input data. ${errors.join('. ')}`
	return new appError(message, 400)
}

module.exports = (err, req, res, next) => {
	
	err.statusCode = err.statusCode || 500
	err.status = err.status || 'error'

	if(process.env.NODE_ENV === 'development'){
		sendErrorDev(err, req, res)
	}else if(process.env.NODE_ENV === 'production'){
		//handle each of particular error to send client in PROD Environment
		let error = {...err}
		if(err.name === 'CastError') {error = handleCastErrorDB(error)}
		if(err.code === 11000){ error = handleDuplicateFieldsDB(error)}
		if(err.name === 'ValidatorError'){ error = handleValidationErrorDB(error)}
		sendErrorProd(error, req, res)
	}
}