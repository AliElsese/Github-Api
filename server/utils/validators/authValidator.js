const { check } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');

const UserModel = require('../../models/user-model');

exports.signupValidator = [
    check('name').notEmpty().withMessage('Name is required')
        .isLength({ min: 3}).withMessage('Too short name'),

    check('email').notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email address')
        .custom(async (val) => {
            await UserModel.findOne({email: val}).then((user) => {
                if(user) {
                    return Promise.reject('Email already exists');
                }
            })
        }),

    check('password').notEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
        .custom((password , {req}) => {
            if(password != req.body.passwordConfirm) {
                throw new Error('Password confirmation incorrect');
            }
            return true;
        }),

    check('passwordConfirm').notEmpty().withMessage('Password confirmation is required'),

    validatorMiddleware
]

exports.loginValidator = [
    check('email').notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email address'),

    check('password').notEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),

    validatorMiddleware
]