const catchAsync = require('../../utils/catchAsync');
const User = require('../model/userModel');

const signUp = catchAsync( async (req,res,next)=>{
    const newUser = await User.create(req.body);

    res.status(201)
        .json({
            status: 'Success',
            data: {
                user: newUser
            }
        })
})