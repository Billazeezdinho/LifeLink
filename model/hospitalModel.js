const mongoose = require('mongoose')

const hospitalSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    }, 
    location:{
        type: String,
        required: true
    },
    isVerified:{
        type:Boolean,
        default: false
    },
    bloodTypes:{
        type:[String],
        required: true
    },
    createdAt:{
        type:Date,
        default: Date.now
    },

},{timestamps: true}
);


exports.HospitalModel = mongoose.model("Hospital", hospitalSchema)