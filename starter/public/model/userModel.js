const mongoose = require('mongoose');
const validator = require('validator');


const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        default: 'NA',
        maxLength: [30,'Length exceded']
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Email is not valid']
    },

photo: {
    type: String
},

password:{
    type: String,
    require: true,
    minLength:  8
},

confirmPassword: {
    type: String,
    required: [true, 'Please confirm password'],
    validate: {
        //Below validator works on create and save only not create.
        validator: function(el){
            return el === this.password;
        },
        message: 'Password is not matching'
    } 
}
});

const User = mongoose.model('User',userSchema);
module.exports = User;