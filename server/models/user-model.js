const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true , 'Name Required']
    },
    email: {
        type: String,
        required: [true , 'Email Required'],
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: [true, 'Password Required'],
        minlength: [6 , 'Too Short Password'],
    }
} , {timestamps: true});

userSchema.pre('save' , async function (next) {
    this.password = await bcrypt.hash(this.password , 12);
    next();
})

const userModel = mongoose.model('User' , userSchema);

module.exports = userModel;