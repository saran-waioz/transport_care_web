// grab the things we need
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    role: Number,  //role 0
    email: String,
    password: String,
});
;
module.exports = mongoose.model('Admin', userSchema);