const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is necessary!']
    },
    email: {
        type: String,
        required: [true, 'Email is necessary!']
    },
    password: {
        type: String,
        required: [true, 'Password is neccesary!']
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
    },
    status: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    },

});

module.exports = mongoose.model('User', userSchema);