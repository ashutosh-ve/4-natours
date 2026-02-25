const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { cpSync } = require('fs');


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

role: {
    type: String,
    required: 'true',
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user'
},

password:{
    type: String,
    required: true,
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
},

    passwordChangedAt: {
        type: Date,
        
    },

    passwordResetToken:String,
    passwordResetExpires: Date
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

    userSchema.methods.changedPasswordAfter = function(JWTTimestamp){
        if(this.passwordChangedAt){
            const changedTimestamp = parseInt(this.passwordChangedAt.getTime()/1000, 10)
            console.log(this.passwordChangedAt, JWTTimestamp, changedTimestamp)
            return JWTTimestamp < changedTimestamp;
        }
        return false;
    }


userSchema.methods.createPasswordResetToken = function(){
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex')
    this.passwordResetExpires = Date.now()+10*60*1000;
    console.log({resetToken}, this.passwordResetToken)
    return resetToken;

}

const User = mongoose.model('User',userSchema);
module.exports = User;