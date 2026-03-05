const mongoose = require('mongoose');
const slugify = require('slugify');
const User = require('./userModel');


const tourSchema = mongoose.Schema({
    name: {
        type: String,
        required: true, // Fixed typo
        unique: true,
        maxlength: [400, 'Les char please']
    },
    
    durations: {
        type: Number,
         // Fixed typo
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
        min: 10
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
        required: [false, 'Path `imageCover` is required.'] // Added proper validation
    },

    slug: String,

    secretTour: {
        type: Boolean,
        default: false
    },

    startLocation: {
        type: {
            type: String,
            default: 'Point',
            enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String

    },

    locations: [
        {
        type: {
            type: String,
            default: 'Point',
            enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number
}],

guides: [
    {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
}
],

reviews: [
    {type: mongoose.Schema.ObjectId,
    ref: 'Review'}
],


    images: [String],
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false
    },
    startDate: [Date]
},
{
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
}
)

tourSchema.virtual('durationWeeks').get( function(){
    return this.durations/7;
})

/// virtual populate
tourSchema.virtual('reviewsVirtual',{
    ref: 'Reviews',
    foreignField: 'tour',
    localField: '_id'
})

// Document middleware
tourSchema.pre('save', function(){
    this.slug = slugify(this.name , {lower: true})
  
})



tourSchema.pre('remove', function(){
    console.log('This is from remove middleare')
  
})

//query middleware
tourSchema.pre('find',function(){
    console.log('--This is from qery middleware--')
    this.find({secretTour: {$ne: true}})
})


//aggregation middleware

tourSchema.pre('aggregate',function(){
    console.log('this is this of aggregate',this);
    console.log(this.pipeline());
    this.pipeline().push({$project: {numRatings: 0}});
})


//populate middleware

tourSchema.pre(/^find/, function(){
    this.populate({
        path: 'guides',
        select: '-__v -passwordChangedAt'
    })
})

// tourSchema.pre('save', async function(){
//     const guidesPromises = this.guides.map(async id => await User.findById(id));
//     this.guides = await Promise.all(guidesPromises);
// })

const Tour = mongoose.model('Tour',tourSchema)
module.exports = Tour;