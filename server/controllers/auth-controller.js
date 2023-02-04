const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');
const UserModel = require('../models/user-model');
const RepoModel = require('../models/repo-model');
// const axios = require('axios');

const generateToken = (payload) => {
    return jwt.sign({userId: payload} , process.env.JWT_SECRET_KEY , {
        expiresIn: process.env.JWT_EXPIRE_TIME
    });
}

module.exports = {
    // registerUser : asyncHandler(async (req,res) => {
    //     var access_token = '';
    //     const client_id = process.env.GITHUB_CLIENT_ID;
    //     const client_secret = process.env.GITHUB_CLIENT_SECRET;
    //     const requestToken = req.query.code;
    //     axios({
    //         method: 'post',
    //         url: `https://github.com/login/oauth/access_token?client_id=${client_id}&client_secret=${client_secret}&code=${requestToken}`,
    //         headers: {
    //             accept: 'application/json'
    //         }
    //     }).then(response => {
    //         access_token = response.data.access_token;
    //         axios({
    //             method: 'get',
    //             url: `https://api.github.com/user`,
    //             headers: {
    //                 Authorization: 'token ' + access_token
    //             }
    //         }).then(async response => {
    //             const oldUser = await UserModel.findOne({userid : response.data.id});
    //             if(!oldUser) {
    //                 const user = await UserModel.create({
    //                     userid: response.data.id,
    //                     name: response.data.name,
    //                     username: response.data.login,
    //                     image: response.data.avatar_url
    //                 });
    //                 res.status(201).json({data : user});
    //             }
    //             else {
    //                 // console.log(response.data.repos_url);
    //                 res.status(201).json({data : oldUser});
    //             }
    //         })
    //     })
    // }),

    signup : asyncHandler(async (req,res) => {
        const user = await UserModel.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        });

        const token = generateToken(user._id);

        res.status(201).json({ data: user, token });
    }),

    login : asyncHandler(async (req,res,next) => {
        const user = await UserModel.findOne({ email: req.body.email });
        if (!user || !(await bcrypt.compare(req.body.password , user.password))) {
            return next(new ApiError('Email or password is incorrect', 401));
        }

        const token = generateToken(user._id);

        const savedRepos = await RepoModel.find({ userid: user._id })

        res.status(200).json({ data: {user, savedRepos}, token });
    }),

    checkToken : asyncHandler(async (req,res,next) => {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(" ")[1];
        }
        if (!token) {
            return next(new ApiError('Please login to access this route'), 401);
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        
        const currentUser = await UserModel.findById(decoded.userId);
        if (!currentUser) {
            return next(new ApiError('The user that belong to this token no longer exist', 401));
        }

        next();
    }),

    
}