const mongoose= require('mongoose');
const dotenv = require('dotenv');
const fs =require('fs');
const Tour = require('./../../public/model/tourModel.js');
dotenv.config({path: './../../config.env'});



const DB = process.env.DATABASE.replace('<PASSWORD>',process.env.PASSWORD);
mongoose.connect(DB).then((conn)=>{
    // console.log(conn.connection);
    console.log('Connection is successful');
})

const tours = JSON.parse( (fs.readFileSync(`${__dirname}/test.json`, 'utf-8')));
console.log('this is log',tours)


const importData = async () =>{
    try{
        await Tour.create(tours);
        console.log('Data Added');
    }catch(err){
        console.error('Error adding data:', err.message);
        console.error(err.stack);
    }
}
importData();