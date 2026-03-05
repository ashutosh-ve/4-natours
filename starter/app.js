const express = require('express');
const fs=require('fs');
const morgan = require('morgan');
const tourRouter = require('./public/tourRouter')
const AppError = require('./utils/appError');
const globalErrorHandle = require('../starter/public/controllers/errorController')
const userRoute = require('./public/userRouter');
const rateLimit =require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean')
const hpp = require('hpp')
const reviewRouter = require('./public/reviewRouter')

const app = express();

//Global middleware
app.use(helmet())

app.use(morgan('dev'))

const limiter = rateLimit({
    max: 20,
    windowMs: 60 * 60 * 1000,
    message: 'too many request from this IP,please try again'
})

app.use('/api',limiter);


app.use(express.json())

//Data sanitazation
// app.use(mongoSanitize());

//xss attacke
// app.use(xss());


// ///prevent paramater pollution (meaning is we hve same multiple parameters)
// app.use(hpp());

app.set('query parser', 'extended');

app.use(express.static(`${__dirname}/public`))

app.use((req,res,next)=>{
    // console.log('this is from middleware');
    // console.log('This is the header', req.headers)
   next();
})



//Router
app.use('/api/v1/tours',tourRouter)

app.use('/api/v1/user',userRoute);
app.use('/api/v1/review',reviewRouter)

app.use((req,res,next)=>{
    next(new AppError('Check router - cought by middleware in app.js', 404));
})

app.use(globalErrorHandle)


// app.get('/api/v1/tours',getAllTours);
// app.get('/api/v1/tours/:id',getTour)
// app.post('/api/v1/tours',addTour)

module.exports = app;