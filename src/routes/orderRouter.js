const express = require('express')
const router = express.Router({ mergeParams: true }) 
const authController = require('../app/controllers/AuthController')
const OrderController = require('../app/controllers/OrderController')

//Protect All User
router.use(authController.protectUsers)

//GET
router.get('/me', OrderController.setOrderIdOfUser, OrderController.getAllOrderWithQuery)

//POST
router.post('/', OrderController.clearCartUser, OrderController.createOrder)

// DELETE-CANCEL my order
router.delete('/:id', OrderController.deleteOrder)

//ADMIN
router.use(authController.restrictTo('admin'))
//DELETE-DESTROY :id -> orderId
router.delete('/:id', OrderController.destroyOrder)

module.exports = router
