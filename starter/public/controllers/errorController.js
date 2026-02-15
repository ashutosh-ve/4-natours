
 module.exports =  (err,req,res,next)=>{
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'failed';

    res.status(err.statusCode)
        .json({
            message: err.message
        })
}