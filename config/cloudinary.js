const cloudinary = require('cloudinary').v2;

// cloudinary.config({
  // cloud_name: process.env.Cloud_name,
  // api_key: process.env.API_key,
  // api_secret: process.env.API_secret,
  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,  // Note the uppercase
    api_key: process.env.API_KEY,        // Note the uppercase
    api_secret: process.env.API_SECRET,  // Note the uppercase
  
  
  API_environment_variable: process.env.API_environment_variable
 });

module.exports = cloudinary;