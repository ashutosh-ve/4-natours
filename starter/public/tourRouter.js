const {getAllTours, getTour, addTour,updateTour,deleteTour,aliasTopTours,getTourStats,getMonthlyPlans} = require('./controllers/tourController');
const express = require('express')
const router = express.Router();
const authController = require('./controllers/authController')

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


module.exports = router;
