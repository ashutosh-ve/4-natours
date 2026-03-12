const express = require('express');
const dotenv = require('dotenv')
dotenv.config({path: './config.env'})
const bookingController = require('./controllers/bookingController')
const authController = require('./controllers/authController')


const router = express.Router();

router.get('/checkout-session/:tourId', authController.protect, bookingController.getCheckoutSession)

module.exports = router