const { MongooseError } = require("mongoose");

const mongoose = rwquire('mongoose');


const bookingSchema = mongoose.Schema({
    tour: {
        type: mongoose.Schema.ObjectId,
        ref: 'Tour',
        required: [true, 'Booking must belong to tour']
    },

    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true,'Please add user']
    },

    price: {
        type: Number,
        required: [true]
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },

    paid: {
        type: Boolean,
        default: true
    }
})


bookingSchema.pre(/^find/, function(){
    this.populate('user').populate({
        path: 'tour',
        select: 'name'
    })
})


const Booking = mongoose.model('Booking', bookingSchema);
module.export = Booking;