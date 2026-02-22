const AppError = require('../../utils/appError')

const handleCastErrorDB = (err) =>{
    const message = `Invlid ${err.path}: ${err.value}`;
    return new AppError(message,404);
}

const handleValidationError = (err) =>{
    
    return new AppError(err,404);
}



const handleJWTError =(err)=>{
    return new AppError('Invalid token please login again',401)
}

const sendErrorDev = (err,res)=>{
    res.status(err.statusCode)
    .json({
        status: err.status,
        message: err.message,
        stack: err.stack
    })
}

const sendErrorProd = (err,res) =>{
    if(err.isOperational){
        res.status(err.statusCode)
            .json({
                status:err.status,
                message: err.message
            })
    }
}

module.exports =  (err,req,res,next)=>{
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if(process.env.NODE_ENV === 'development'){

        // let error =  err;
        // console.log(error)
        // if(err.name === 'CastError')
        //         error = handleCastErrorDB(error);

        let error = { ...err };
        error.message = err.message;

        if (err.name === 'CastError')
            error = handleCastErrorDB(error);

        if (err.code === 11000)
            error = handleValidationError(err);

        if (err.name === 'ValidationError')
            error = handleValidationError(err);

        if(err.name === 'JsonWebTokenError')
            error = handleJWTError(err);

        sendErrorDev(error,res);
       

    }else if(process.env.NODE_ENV === 'production'){
        let error = err;
        console.log(error)
        if(err.name === 'CastError')
                error = handleCastErrorDB(error);
        sendErrorProd(error,res);
    }   
}
