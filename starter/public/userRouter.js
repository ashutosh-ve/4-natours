const express = require('express');
const tourController = require('./controllers/tourController');
const authController = require('./controllers/authController');
const { model } = require('mongoose');
const {createUser,getUser, getUserById,deleteUserById,updateUser} = require('./controllers/userController');

const router = express.Router();

router.post('/signup',authController.signup)

router.route('/')
        .get(getUser)
        .post(createUser)


router.route('/:id')
        .get(getUserById)
        .delete(deleteUserById)
        .patch(updateUser)


module.exports = router;