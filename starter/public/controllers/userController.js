const catchAsync = require('../../utils/catchAsync');
const User = require('../model/userModel');


const createUser =  catchAsync (async (req,res,next)=>{
    const newUser = await User.create(req.body);

    res.status(201)
        .json({
            status: 'success',
            data: {
                newUser
            }
        })
})

const  getUser = catchAsync(async (req,res,next)=>{
    const users = await User.find();

    res.status(200)
        .json({
            status: 'success',
            users
        })
})


const getUserById = catchAsync(async (req,res,next)=>{
    const userId = req.params.id;

    const user = await User.findById(userId);

    res.status(200)
        .json({
            status: 'Success',
            user
        })
})


const deleteUserById = catchAsync(async (req,res,next)=>{
    const userId = req.params.id;

    const user = await User.findByIdAndDelete(userId);

    res.status(201)
        .json({
            status: 'Deleted',
            user
        })

})

const updateUser = catchAsync(async (req,res,next)=>{
    const userId = req.params.id;
    const user = await User.findByIdAndUpdate(userId,req.body,{
        new: true,
        runValidators: true
    });

    res.status(201)
        .json({
            status: 'Updated',
            user
        })
})

module.exports = {
    createUser,
    getUser,
    getUserById,
    deleteUserById,
    updateUser
}