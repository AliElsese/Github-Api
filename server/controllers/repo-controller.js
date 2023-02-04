const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');
const RepoModel = require('../models/repo-model');
const axios = require('axios');

const getUserIdFromToken = (token) => {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);  
    return decoded.userId;
}

module.exports = {
    getUsernameRepos : asyncHandler(async (req,res) => {
        const username = req.params.username;

        const page = req.query.page * 1 || 1;
        const limit = req.query.limit * 1 || 10;
        const skip = (page - 1) * limit;

        await axios.get(`https://api.github.com/users/${username}/repos`).then(response => {
            let data = response.data.slice(skip,limit*page);
            
            res.status(201).json({
                results: response.data.length,
                page: page,
                data: data
            });
        });
    }),

    saveRepo : asyncHandler(async (req,res) => {
        const repo = req.body;

        const token = req.headers.authorization.split(" ")[1];
        const userId = getUserIdFromToken(token);

        const savedRepo = await RepoModel.create({
            repoid: repo.id,
            repoowner: repo.owner.login,
            reponame: repo.name,
            repourl: repo.html_url,
            img: repo.owner.avatar_url,
            userid: userId,
        });

        res.status(201).json({ data: repo });
    }),

    getAllSavedRepos : asyncHandler(async (req,res) => {
        const page = req.query.page * 1 || 1;
        const limit = req.query.limit * 1 || 10;
        const skip = (page - 1) * limit;

        const token = req.headers.authorization.split(" ")[1];
        const userId = getUserIdFromToken(token);

        const repos = await RepoModel.find({ userid: userId });
        let data = repos.slice(skip,limit*page);
        
        res.status(200).json({
            results: repos.length,
            page: page,
            data: data
        })
    }),

    removeRepo : asyncHandler(async (req,res,next) => {
        const { id } = req.params
        const repo = await RepoModel.findByIdAndDelete({ _id : id })
        if(!repo) {
            next(new ApiError(`No Repo For This Id ${id}` , 404))
        }
        else {
            res.status(204).json({success: true})
        }
    })
}