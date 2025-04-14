const { Module } = require('vm');
const cloudinary = require('cloudinary').v2;


// cloudinary.config({
//     cloud_name: process.env.Cloud_name,
//     api_key: process.env.API_key,
//     api_secret: process.env.API_secret,
//     API_environment_variable: process.env.API_environment_variable
// });


cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

module.exports = cloudinary;