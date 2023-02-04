const express = require('express');
const router = express.Router();

const { checkToken } = require('../controllers/auth-controller');

const {
    getUsernameRepos,
    saveRepo,
    getAllSavedRepos,
    removeRepo
} = require('../controllers/repo-controller');

router.get('/getRepo/:username' , checkToken , getUsernameRepos);
router.post('/saveRepo' , checkToken , saveRepo);
router.get('/getAllSavedRepo', checkToken , getAllSavedRepos);
router.delete('/removeRepo/:id', checkToken , removeRepo);

module.exports = router;