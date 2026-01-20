const {getAllTours, getTour, addTour} = require('./controllers/tourController');
const express = require('express')
const router = express.Router();



router    
    .route('/')
    .get(getAllTours)
    .post(addTour)

router
    .route('/:id')
    .get(getTour)


module.exports = router;
