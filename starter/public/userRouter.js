const express = require('express');
const tourController = require('./controllers/tourController');
const authController = require('./controllers/authController');
const { model } = require('mongoose');
const {createUser,getUser, getUserById,deleteUserById,updateUser, updateMe,deleteMe, getMe, uploadUserPhoto} = require('./controllers/userController');
const { route } = require('./userRouter');
const reviewsController = require('../public/controllers/reviewController');


const router = express.Router();



router.post('/signup',authController.signup)
router.post('/login',authController.login)
router.post('/forgotPassword',authController.forgotPassword)
router.patch('/resetPassword/:token',authController.resetPassword)

router.patch('/updateMypassword',authController.protect, authController.updatePassword)

router.patch('/updateMe', uploadUserPhoto , authController.protect, updateMe)
router.delete('/deleteMe',authController.protect, deleteMe)

router.route('/')
        .get(getUser)
        .post(createUser)

router.route('/getMe')
        .get(authController.protect, getMe)


router.route('/:id')
        .get(getUserById)
        .delete(deleteUserById)
        .patch(updateUser)





module.exports = router;