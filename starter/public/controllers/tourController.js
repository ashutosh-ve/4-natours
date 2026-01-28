const { response } = require('../../app');
const Tour = require('./../model/tourModel')


// const tours = JSON.parse(fs.readFileSync(`${__dirname}/../../dev-data/data/tours.json`));

const getAllTours = async (req,res)=>{
    try{
        // console.log(req.query);
        const queryObj = {...req.query};
        const excludedFileds = ['page','sort','limit','fields'];
        excludedFileds.forEach(el=> delete queryObj[el]); 
       
// Advance filtering
        let queryString = JSON.stringify(queryObj);
        console.log(queryString)
        queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}` );
        console.log(JSON.parse(queryString));
       


   const findQuery = Tour.find(JSON.parse(queryString));
   const allUser = await findQuery;
   res.json({
    status: 'Success',
    total:  allUser.length,
    data: {
        allUser
    }
   })
}catch(err){
    console.log(err)
    res.status(404).json(err);
}
}




const getTour = async (req,res)=>{
    
    const id = req.params.id;
    try{
    const user = await Tour.findById(id);    
    res.json({
        data: user
    })
    }catch(err){
        res.send(err);
    }
}

const addTour = async (req, res) => {
    // const newId = Math.random();
    // const newTour = new Tour({
    //     id: newId,
    //     name: req.body.name,
    //     rating: req.body.rating,
    //     price: req.body.price,
    //     imageCover: req.body.imageCover, // Added required field
    //     maxGroupSize: req.body.maxGroupSize, // Added required field
    //     durations: req.body.durations // Added required field
    // });
    const newTour = await Tour.create(req.body);
    newTour.save()
        .then(() => {
            console.log('Tour is added');
            res.send('Tour Added successfully');
        })
        .catch((err) => {
            res.status(400).send(err); // Updated to send proper status code
        });
};

const updateTour = async (req,res)=>{
    const id = req.params.id;
    try{
        const tour = await Tour.findByIdAndUpdate(id,req.body,{
            new: true,
            runValidators: true
        })
        res.status(200).json({
            tour: tour
        })
    }catch(err){
        res.send(err);
    }
}


const deleteTour = async (req,res)=>{
    const id = req.params.id;

    try{
        const result = await Tour.findByIdAndDelete(id);
        res.status(201).send({
            result: result
        })
    }catch(err){
        res.send(err);
    }
}


module.exports = {
    getAllTours,
    getTour,
    addTour,
    updateTour,
    deleteTour
}
