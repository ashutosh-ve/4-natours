const express = require('express');
const fs=require('fs');
const morgan = require('morgan');
const tourRouter = require('./public/tourRouter')
const app = express();
const AppError = require('./utils/appError');
const globalErrorHandle = require('../starter/public/controllers/errorController')

app.use(express.json())
app.set('query parser', 'extended');

app.use(express.static(`${__dirname}/public`))

app.use((req,res,next)=>{
    console.log('this is from middleware');
   next();
})

app.use(morgan('dev'))

//Router
app.use('/api/v1/tours',tourRouter)

app.use((req,res,next)=>{
    next(new AppError('We got an error shit', 404));
})

app.use(globalErrorHandle)


// app.get('/api/v1/tours',getAllTours);
// app.get('/api/v1/tours/:id',getTour)
// app.post('/api/v1/tours',addTour)

module.exports = app;