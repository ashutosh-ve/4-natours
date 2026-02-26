const {promisify} = require('util');
const AppError = require('../../utils/appError');
const catchAsync = require('../../utils/catchAsync');
const User = require('../model/userModel');
const jwt = require('jsonwebtoken');
const sendEmail = require('../../utils/email')
const crypto = require('crypto');

const signToken=(id)=>{
    return jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPIRES_IN
    })
}

exports.signup = catchAsync( async (req,res,next)=>{
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        passwordChangedAt: req.body.passwordChangedAt,
        role: req.body.role
    });

    
    const token = signToken(newUser._id)

    res.status(201)
        .json({
            status: 'Success',
            token,
            data: {
                user: newUser
            }
        })
})


exports.login = catchAsync(async(req,res,next)=>{
    const {email, password} = req.body;

    // 1) Check if email and pass exist
        if(!email || !password){
           return next(new AppError('Please provide valid email and password',400))
        }    


    // 2) check if user exist && password is correct
        const user = await User.findOne({email: email}).select('+password')
        // const correct = await user.correctPassword(password,user.password);
        
        if(!user || !(await user.correctPassword(password,user.password))){
            return next(new AppError('Incorrect username and pasword',401))
        }
    // 3)  If everything is good, send token to client

const token= signToken(user._id);

res.status(200)
        .json({
            status: 'Success',
            token
        })
})



exports.protect = catchAsync( async (req,res,next )=>{
    // 1) Get token
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
       token = req.headers.authorization.split(' ')[1];
    }

    console.log(token);

    if(!token){
        return next(new AppError('You are not logged in, Please log in'))
    }


    //2) ValidateToken
       const decode = await promisify( jwt.verify)(token, process.env.JWT_SECRET)
    //    console.log(decode);
    //3) Check if user exist
    
    const freshUser = await User.findById(decode.id);

    if(!freshUser){
        return next(new AppError('Tocken with this user does not exist', 401));
    }



    //4 Check if user changed pass after jwt token was issued.
    if (freshUser.changedPasswordAfter(decode.iat)){
        return next(new AppError('Password changged recently',401))
    }

    //We wll now give access to the route
    req.user = freshUser;
    next()
})



exports.restrictTo = (...role) =>{
    return (req,res,next)=>{
        if(!role.includes(req.user.role)){
            return next(new AppError('You are not authorized to delete',403))
        }
            next();
    }
}


exports.forgotPassword = catchAsync (async (req,res,next)=>{

    //1 Get User
    const user = await User.findOne({email: req.body.email});
    if(!user){
        return next(new AppError('User name and email not found',404))
    }
    //2 Generate the random reset token
    const resetToken = user.createPasswordResetToken();
        await user.save({validateBeforeSave: false});

    //3 Send it to user email
    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
    const message= `OOps! forgot passsword? Submit a PATCH req in ${resetURL}`


    try{

         await sendEmail({
        email: user.email,
        subject: 'Link valid for 10 mins',
        message
    })

    }catch(err){
        user.passwordResetToken= undefined;
        user.passwordResetExpires = undefined;
        await user.save({validateBeforeSave: false})

        return next(new AppError('Error sending email to user',500))
    }
   

    res.status(200)
        .json({
            status: 'Success',
            message: 'Token send'
        })
})



exports.resetPassword= async(req,res,next)=>{
    //1) Get user based token
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    
    

    // 2) if token not expired and user exist, then we will reset pass

const user = await User.findOne({passwordResetToken: hashedToken, passwordResetExpires: {$gt: Date.now()}});

    if(!user){
        return next(new AppError('Token is invalid or expired',400))
    }

    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;

    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    // 3) Update changedPasswordAt property of user
    const token = signToken(user._id);

    res.status(200)
        .json({
            status: 'Success',
            token
        })


    //4) Log the user in, send JWT                   


    next()
} 