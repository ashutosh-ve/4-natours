const catchAsync = require("../../utils/catchAsync")
const Reviews = require('../model/reviewModel')

exports.getAllReviews = catchAsync(async (req,res,next)=>{
        let filter = {};

        console.log('sdssds',req.params.tourId)
        if(req.params.tourId)
            filter = {tour: req.params.tourId};

        console.log('👌',filter)
        const reviews = await Reviews.find(filter);

        res.status(200)
            .json({
                total: reviews.length,
                status: 'Success',
                reviews
            })
})

exports.addReview = catchAsync(async(req,res,next)=>{
    //allow nested routes
    if(!req.body.tour)
        req.body.tour = req.params.tourId;

    if(!req.body.user)
        req.body.user = req.user.id;
    const review = await Reviews.create(req.body);

    res.status(200)
        .json({
            status: 'Success',
            review
        })
})


exports.deleteReview = catchAsync(async (req,res,next)=>{
    await Reviews.findByIdAndDelete(req.params.id)

    res.status(200)
        .json({
            status: 'success',
            message: 'Review Deleted succesfully'
        })
})