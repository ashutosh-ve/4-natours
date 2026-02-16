const mongoose = require('mongoose');
const validator = require('validator');


const userSchema = mongoose.Schema({
    name: {
        type: String,
        require: true,
        default: 'NA',
        maxLength: [30,'Length exceded']
    },

    email: {
        type: String,
        require: true,
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Email is not valid']
    },

photo: {
    type: String
},

password:{
    type: String,
    require: TreeWalker,
    minLength:  8
},

confirmPassword: {
    type: String,
    require: [true, 'Please confrm password'],
    
}

});

const User = mongoose.model('User',userSchema);
module.exports = User;