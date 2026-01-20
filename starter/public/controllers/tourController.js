
const fs = require('fs');

const tours = JSON.parse(fs.readFileSync(`${__dirname}/../../dev-data/data/tours.json`));

const getAllTours = (req,res)=>{
    res
        .status(200)
        .json({
            status: 'Suucces',
            results: tours.length,
            data: {
                tours: tours
            }
        });
}

const getTour = (req,res)=>{
    console.log(req.params);
    res.json({data: 'This is data send from server'})
}


const addTour = (req,res)=>{
    const newId = tours.length+1;
    const newTour = Object.assign({id: newId},req.body);

    tours.push(newTour);
    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`,JSON.stringify(tours),(error)=>{
        res
            .status(201)
            .send(newTour);
    })
}


module.exports = {
    getAllTours,
    getTour,
    addTour
}