const express = require('express');
const tourController = require('./controllers/tourController');
const authController = require('./controllers/authController');
const { model } = require('mongoose');
const {createUser,getUser, getUserById,deleteUserById,updateUser} = require('./controllers/userController');
const { route } = require('./userRouter');

const router = express.Router();

router.post('/signup',authController.signup)
router.post('/login',authController.login)
router.post('/forgotPassword',authController.forgotPassword)
router.post('/resetPassword',authController.resetPassword)

router.route('/')
        .get(getUser)
        .post(createUser)


router.route('/:id')
        .get(getUserById)
        .delete(deleteUserById)
        .patch(updateUser)


module.exports = router;