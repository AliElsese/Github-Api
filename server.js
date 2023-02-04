const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');

dotenv.config({path:"config.env"});
const ApiError = require('./server/utils/apiError');
const globalError = require('./server/middlewares/errorMiddleware');
const dbConnection = require('./server/database/connection');

const headers = require('./server/middlewares/setHeaders');

const authRoutes = require('./server/routes/auth-router');
const repoRoutes = require('./server/routes/repo-router')

// Connect with DB
dbConnection();

// Express App
const app = express();
const PORT = process.env.PORT || 8001;

// Middleware
app.use(express.json());
app.use(headers.setHeaders);
app.use(cors());

if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
    console.log(`mode : ${process.env.NODE_ENV}`);
}

// Mount Routes
app.use('/auth' , authRoutes);
app.use('/repo' , repoRoutes);

app.all('*' , (req,res,next) => {
    next(new ApiError(`Can't find this route : ${req.originalUrl}` , 400));
})

app.use(globalError);

const server = app.listen(PORT , () => {
    console.log(`App Running On http://localhost:${PORT}`);
})

process.on("unhandledRejection" , (err) => {
    console.error(`UnhandledRejection Errors : ${err.name} | ${err.message}`);
    server.close(() => {
        console.log(`Shutting down....`);
        process.exit(1);
    })
})