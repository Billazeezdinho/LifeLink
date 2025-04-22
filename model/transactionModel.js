const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    email: {
        type: String,
        required:true
    },
    name: {
        type: String,
        required:true,
        trim:true
    },
    amount: {
        type: Number,
        required:true
    },
    reference: {
        type: String,
        required:true
    },
    status: {
        type: String,
        enum:['pending', 'success', 'failed'],
        default: 'pending'
    },
    paymentDate:{
        type: String,
        required: true
    }
},{timestamps: true});

exports.transactionModel = mongoose.model('Transactions', transactionSchema);
