const {getAllTours, getTour, addTour,updateTour,deleteTour,aliasTopTours,getTourStats,getMonthlyPlans} = require('./controllers/tourController');
const express = require('express')
const router = express.Router();
const authController = require('./controllers/authController')
// const reviewController = require('./controllers/reviewController')
const reviewRouter = require('../public/reviewRouter')

router.use('/:tourId/reviews', reviewRouter)

router
    .route('/top-5-cheap')
    .get(aliasTopTours,getAllTours)


router
    .route('/tour-stats')
    .get(getTourStats)


router
    .route('/monthly-plan/:year')
    .get(getMonthlyPlans)

router    
    .route('/')
    .get(authController.protect, getAllTours)
    .post(addTour)

router
    .route('/:id')
    .get(getTour)
    .patch(updateTour)
    .delete(authController.protect,authController.restrictTo('admin', 'lead-guy'),deleteTour)
    
// router.route('/:tourId/reviews')
//         .post(authController.protect,
//                 authController.restrictTo('admin'),
//                 reviewController.addReview
//         )   

module.exports = router;
