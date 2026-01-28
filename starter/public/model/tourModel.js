const mongoose = require('mongoose');

const tourSchema = mongoose.Schema({
    name: {
        type: String,
        required: true, // Fixed typo
        unique: true
    },
    
    durations: {
        type: Number,
        required: [true, 'This value is required'], // Fixed typo
    },
    maxGroupSize: {
        type: Number,
        required: [true, 'This value is required'], // Fixed typo    
    },

    ratingsAverage: {
        type: Number,
        required: true, // Fixed typo
        default: 4.5
    },
    ratingsQuentity: {
        type: Number,
        required: [true, 'This value is required'],
        default: 0
    },
    price: {
        type: Number,
        required: [true, 'This is a required value'], // Fixed typo
    },

    discount: {
        type: Number
    },
    summary: {
        type: String,
        trim: true,
    },
    description: {
        type: String,
        trim: true
    },
    imageCover: {
        type: String,
        required: [true, 'Path `imageCover` is required.'] // Added proper validation
    },
    images: [String],
    createdAt: {
        type: Date,
        default: Date.now()
    },
    startDate: [Date]
})

const Tour = mongoose.model('Tour',tourSchema)
module.exports = Tour;