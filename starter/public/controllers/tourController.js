// const { response } = require('../../app');
const Tour = require('./../model/tourModel')
const APIFeatures = require('./../../utils/apiFeatures')
const catchAsync = require('../../utils/catchAsync')
const AppError = require('../../utils/appError')

const getAllTours = async (req,res)=>{
    try{
//         console.log('This is req query',req.query)
        
//         const queryObj = {...req.query};
//         const excludedFileds = ['page','sort','limit','fields'];
//         excludedFileds.forEach(el=> delete queryObj[el]); 
       
// // Advance filtering
//         let queryString = JSON.stringify(queryObj);
//         console.log(queryString);
//         queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}` );
//         console.log(JSON.parse(queryString));
       


//    let query = Tour.find(JSON.parse(queryString));

//Now we are sorting the query

// if(req.query.sort){
//     query.sort(req.query.sort)    
// }




// Field limiting

// if(req.query.fields){
//     const fields = req.query.fields.split(',').join(' ');
//     query = query.select(fields);
//     // console.log(findQuery);
// }else{
//     query = query.select('-__v')
// }


//Pagination

// const page =  req.query.page * 1 || 1;
// const limit = req.query.limit * 1 || 100;
// const skip = (page-1) * limit;

// query = query.skip(skip).limit(limit);

// if(req.query.page){
//     const totalDoc = await Tour.countDocuments();
//     if(skip>totalDoc){
//         throw new Error('Limit Exceeded');
//     }
// }

    const features = new APIFeatures(Tour.find(),req.query)
        .filter()
        .sort()
        .limitField()
        .paginate();


   const allUser = await features.query;
   res.json({
    status: 'Success',
    total:  allUser.length,
    data: {
        allUser
    }
   })
}catch(err){
    console.log(err)
    res.status(404).json('we got some error',err);
}
}




// const getTour = async (req,res)=>{
    
//     const id = req.params.id;

  
//     try{
//     const user = await Tour.findById(id);
//     if (!user) {
//         return next(new AppError('No tour found with that ID', 404));
//     }
    
    
//     res.json({
//         data: user
//     })
//     }catch(err){
//         res.send(err);
//     }
// }



const getTour = catchAsync(async (req, res, next) => {
    const user = await Tour.findById(req.params.id);

    if (!user) {
        return next(new AppError('No tour found with that ID',200));
    }

    res.json({ data: user });
});




    const addTour = catchAsync( async (req, res, next) => {
        const newTour = await Tour.create(req.body);
      
        res.status(201).json({
          message: 'Tour added successfully',
          newTour
        });
      });




//     const newTour = await Tour.create(req.body);
//     newTour.save()
//         .then(() => {
//             console.log('Tour is added');
//             res.json({ message: 'Tour Added successfully', newTour});
//         })
//         .catch((err) => {
//             res.status(400).send(err); // Updated to send proper status code
//         });
// };

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

const aliasTopTours = async (req,res,next)=>{
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,summary';
    next();
}

const getTourStats = async (req,res)=>{
    try{
        const stats = await Tour.aggregate([
            {
                $match: {ratingsAverage: {$gte: 4.5}}
            },

            {
                $group: {
                    _id: '$ratingsAverage',
                    numTours: {$sum: 1},
                    numRatings: {$sum: '$ratingsQuentity'},
                    avgRating: {$avg: '$ratingsAverage'},
                    avgPrice: {$avg: '$price'},
                    minPrice: {$min: '$price'},
                    maxPrice: {$max: '$price'},
                    
                }
            },
            {
                $sort: {
                    avgPrice: 1
                }
            }
        ])

        res.status(200)
            .json({
                status: 'success',
                data: {
                    stats
                }
            })


    }catch(err){
        res.status(404)
            .json({
                status: 'Failed',
                message: `we got some error ${err}`
            })
    }
}

const getMonthlyPlans = async (req,res)=>{
    try{

        const year = req.params.year * 1;
        const plan = await Tour.aggregate([
            {
                $unwind: '$startDate'
            },
            {
                $match: {startDate: { 
                    $gte: new Date(`2022-12-31`)
                }}
            },
            {
                $group: {
                    _id: {$month: '$startDate'},
                    totalNumTour: {$sum: 1},
                    tours: {$push: '$name'}
                }
            },

           { 
            $addFields: {month: '$_id'}
        },

        {
            $project: {_id: 0}
        },
        {
            $sort: {totalNumTour: -1}
        },
        {
            $limit: 6
        }
        ])   
        
        
        res.status(200)
        .json({
            status: 'success',
            data: {
                plan
            }
        })
    }catch(err){
        res.status(404)
            .json({
                status: 'Failed',
                message: `We got some error: ${err}`
            })
    }
}


module.exports = {
    getAllTours,
    getTour,
    addTour,
    updateTour,
    deleteTour,
    aliasTopTours,
    getTourStats,
    getMonthlyPlans
}
