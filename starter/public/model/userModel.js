const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');


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
    minLength:  8,
    // select: false
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


    userSchema.pre('save', async function(){
        if(!this.isModified('password'))
        return;

        this.password = await bcrypt.hash(this.password,12);
        this.confirmPassword = undefined;
    })


    userSchema.methods.correctPassword = async function(candidatePassword, userPassword){
        return await bcrypt.compare(candidatePassword,userPassword);
    }

const User = mongoose.model('User',userSchema);
module.exports = User;