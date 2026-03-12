const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const Tour = require('./../model/tourModel')
const APIFeatures = require('./../../utils/apiFeatures')
const catchAsync = require('../../utils/catchAsync')
const AppError = require('../../utils/appError')


exports.getCheckoutSession = catchAsync(async (req,res,next)=>{
    const tour = await Tour.findById(req.params.tourId);

    // creating session
   const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        success_url: `${req.protocol}://${req.get('host')}/`,
        cancel_url: `${req.protocol}://${req.get('host')}/tour/`,
        customer_email: req.user.email,
        client_reference_id: req.params.tourId,
        line_items: [
            {
                price_data: {
                    currency: 'usd',
                    unit_amount: tour.price * 100,
                    product_data: {
                        name: `${tour.name} Tour`,
                        description: tour.summary,
                        images: [`${req.protocol}://${req.get('host')}/img/tours/${tour.imageCover}`]
                    }
                },
                quantity: 1
            }
        ]
    });

    res.status(200) 
        .json({
            status: 'Success',
            session
        })
})