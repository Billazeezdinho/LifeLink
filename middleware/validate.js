// import Joi
const Joi = require('joi')

exports.registerValidate = async (req, res, next) =>{
    const schema = Joi.object({
        fullName: Joi.string()
        .min(3)
        .trim()
        .pattern(/^[A-Za-z ]+$/)
        .required()
        .messages({
            "any.required": ' FullName is required',
            "string.empty": 'full Name cannot be empty',
            "string.pattern.base": "FullName should only contain alphabets",
            "string.min": "fullname should not be less than 3 letters"
        }),
        email: Joi.string()
        .email()
        .pattern(/^\S+@\S+\.\S+$/) 
        .required()
        .messages({
            "string.email": "Invalid email format",
            "any.required": "Email is required",
            "string.pattern.base": "Email should not contain spaces"
        }),

    password: Joi.string()
        .min(8)
        .pattern(/^\S+$/) 
        .required()
        .messages({
            "any.required": "Password is required",
            "string.empty": "Password cannot be empty",
            "string.min": "Password must be at least 8 characters long",
            "string.pattern.base": "Password should not contain spaces"
        })




        // email: Joi.string()
        // .email()
        // .required()
        // .messages({
        //     "string.email": "Invalid email format",
        //     "any.required":"Email is required"
        // }),
        // password: Joi.string()
        // .min(8)
        // .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/)
        // .required()
        // .messages({
        //     "any.required": "Password is required",
        //     "string.empty": " password cannot be empty",
        //     "string.pattern.base": "Password must be minimum of 8 character and include at least one UpperCase, Lowercase and a special character [!@#$%^&*].",
        // })

    })
    const result = schema.validate(req.body, {abortEarly: false})
    console.log(result)
    next();
    
} ;
