const mongoose = require('mongoose');

const repoSchema = new mongoose.Schema({
    repoid: {
        type: Number
    },
    repoowner: {
        type: String
    },
    reponame: {
        type: String
    },
    repourl: {
        type: String
    },
    userid: {
        type: String
    },
    img: {
        type: String
    }
} , {timestamps : true});

const RepoModel = mongoose.model('Repo' , repoSchema);

module.exports = RepoModel;