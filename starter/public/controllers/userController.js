const AppError = require('../../utils/appError');
const catchAsync = require('../../utils/catchAsync');
const User = require('../model/userModel');
const multer = require('multer');

const multerStorage = multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null, 'public/img/users')
    },
    filename: (req,file,cb)=>{
        const ext = file.mimetype.split('/')[1];
        cb(null, `user-balaaa-${Date.now()}.${ext}`);
}
})

const multiFilter=(req,file,cb)=>{
    if(file.mimetype.startsWith('image')){
        cb(null,true)
    }else{
        cb(new AppError('Wrong file type',400), false)
    }
}

const upload = multer({
    storage: multerStorage,
    fileFilter: multiFilter
})

const uploadUserPhoto = upload.single('photo')

const filterObj = (obj, ...allowedFields) =>{
    const newObj = {};
    
    Object.keys(obj).forEach(el =>{
        if(allowedFields.includes(el))
            newObj[el] = obj[el]

    })
return newObj;
}


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


const updateMe = async (req,res,next) =>{
    //1) crate error if user post pass data
    console.log(req.file)
    if(req.body.password || req.body.confirmPassword){
        return next(new AppError('Updating pass through this route is not allowed',400))
    }
    console.log('below is the request',req.user)

    const filteredBody = filterObj(req.body, 'name', 'email');
    const user = await User.findByIdAndUpdate(req.user.id,filteredBody,{
        new: true,
        runValidators: true
    })

    res.status(200)
        .json({
            status: 'Success'
        })

}


const deleteMe = catchAsync (async (req,res,next)=>{
    const user = await User.findByIdAndUpdate(req.user.id, {active: false}, {new: true, runValidators: true});
    if(!user){
        return next(new AppError('Unable to find user',400));
    }

    res.status(200)
        .json({
            status: 'Success',
            user
        })
})

const getMe = catchAsync( async(req,res,next) =>{
    const findUser = await User.findById(req.user.id);

    res.status(200)
        .json({
            status: 'Success',
            findUser
        })
})

module.exports = {
    createUser,
    getUser,
    getUserById,
    deleteUserById,
    updateUser,
    updateMe,
    deleteMe,
    getMe,
    uploadUserPhoto
}