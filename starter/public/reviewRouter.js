const express = require('express');
const router = express.Router();
const reviewController = require('./controllers/reviewController')

router.route('/')
    .get(reviewController.getAllReviews)
    .post(reviewController.addReview)
    
router.route('/:id')
    .delete(reviewController.deleteReview)

module.exports  = router;