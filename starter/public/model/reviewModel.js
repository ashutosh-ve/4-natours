const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema({
    review: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    tour: {
        type: mongoose.Schema.ObjectId,
        ref: 'Tour',
        required: true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
},
{
        toJSON: {virtuals: true},
        toObject: {virtuals: true},
    }
)

reviewSchema.index({tour: 1, user: 1}, {unique: true})

reviewSchema.pre(/^find/, function(){
    this.populate(['user'])
})



const Reviews = mongoose.model('Reviews', reviewSchema)
module.exports = Reviews;