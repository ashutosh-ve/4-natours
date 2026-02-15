const app = require('./app.js')
const dotenv = require('dotenv')
const mongoose = require('mongoose');
dotenv.config({path: './config.env'})
console.log(app.get('env'))




const DB = process.env.DATABASE.replace('<PASSWORD>',process.env.PASSWORD);
mongoose.connect(DB).then((conn)=>{
    // console.log(conn.connection);
    console.log('Connection is successful');
})



const port = process.env.PORT || 8001;

app.listen(port,'127.0.0.1', ()=>{
    console.log('Server is listning to port - ',port);
})


