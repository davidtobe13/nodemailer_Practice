const mongoose = require('mongoose');

const mySchema = new mongoose.Schema({
    firstName:{
        type: String},

    lastName:{
        type: String},

    email:{
        type: String},

    number:{
        type: String},

    password:{
        type: String},

    token:{
        type: String},
    
    isVerified: {
        type: Boolean,
        default: false
    }
}, {timestamps:true})

const myModel = mongoose.model('locationAPI', mySchema)

module.exports = myModel 