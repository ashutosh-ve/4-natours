const mongoose= require('mongoose');
const dotenv = require('dotenv');
const fs =require('fs');
const Tour = require('./../../public/model/tourModel.js');
const User = require('./../../public/model/userModel.js');
const Reviews = require('./../../public/model/reviewModel.js');
dotenv.config({path: './../../config.env'});



const DB = process.env.DATABASE.replace('<PASSWORD>',process.env.PASSWORD);
mongoose.connect(DB).then((conn)=>{
    // console.log(conn.connection);
    console.log('Connection is successful');
})

// const tours = JSON.parse( (fs.readFileSync(`${__dirname}/tours.json`, 'utf-8')));
const users = JSON.parse( (fs.readFileSync(`${__dirname}/users.json`, 'utf-8')));
// const reviews = JSON.parse( (fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8')));



const importData = async () =>{
    try{
        // await Tour.create(tours);
        await User.create(users);
        // await Reviews.create(reviews);
        console.log('Data Added');
    }catch(err){
        console.error('Error adding data:', err.message);
        console.error(err.stack);
    }
}
importData();