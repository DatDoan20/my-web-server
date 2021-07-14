const catchAsync = require('../handler/catchAsync')
const Product = require('../models/Product')
const appError = require('../handler/appError')
const APIFeature = require('../../utils/apiFeature')
const factory = require('./HandlerFactory')

// POST /api/products (admin)
exports.createProduct = factory.createOneDocument(Product)

//	PATCH api/products (update any field - admin) - NOT DELETE -> set outOfStock: true  (admin)
exports.updateProduct = factory.updateOneDocument(Product)

// GET / api/products/:id  get one product 
exports.getOneProduct = factory.getOneDocument(Product, {path: 'reviews'})

// GET /api/products/search?  
exports.getAllProductWithQuery = factory.getAllDocuments(Product, {path: 'reviews'})


// exports.aliasNewestProducts = catchAsync( async (req, res, next) =>{
// 	req.query.limit = '10'
// 	next() will call getProductsWithQuery
// })

