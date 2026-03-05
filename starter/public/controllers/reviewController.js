const catchAsync = require("../../utils/catchAsync")
const Reviews = require('../model/reviewModel')

exports.getAllReviews = catchAsync(async (req,res,next)=>{
        const reviews = await Reviews.find();

        res.status(200)
            .json({
                status: 'Success',
                reviews
            })
})

exports.addReview = catchAsync(async(req,res,next)=>{
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