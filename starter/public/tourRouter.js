const {getAllTours, getTour, addTour,updateTour,deleteTour} = require('./controllers/tourController');
const express = require('express')
const router = express.Router();



router    
    .route('/')
    .get(getAllTours)
    .post(addTour)

router
    .route('/:id')
    .get(getTour)
    .patch(updateTour)
    .delete(deleteTour)


module.exports = router;
