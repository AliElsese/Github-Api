const ApiError = require("../utils/apiError");

// Error Development Mode Function
const sendErrorForDevMode = (err,res) => {
    return res.status(err.statusCode).json({
        status : err.status,
        error : err,
        message : err.message,
        stack : err.stack
    })
}

// Error Production Mode Function
const sendErrorForProdMode = (err,res) => {
    return res.status(err.statusCode).json({
        status : err.status,
        message : err.message,
    })
}

const handleJwtInvalidSignature = () => new ApiError('Invalid token, please login again..', 401);

const handleJwtExpired = () => new ApiError('Expired token, please login again..', 401);

// Global Error Handling Midlleware
const globalError = (err,req,res,next) => {
    err.statusCode = err.statusCode || 500
    err.status = err.status || 'error'

    if(process.env.NODE_ENV == 'development') {
        sendErrorForDevMode(err,res)
    }
    else {
        if (err.name === 'JsonWebTokenError') err = handleJwtInvalidSignature();
        if (err.name === 'TokenExpiredError') err = handleJwtExpired();
        sendErrorForProdMode(err,res);
    }
}

module.exports = globalError