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
        .required()
        .min(5)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{5,}$/)
        .messages({
            "any.required": "Password is required",
            "string.empty": "Password cannot be empty",
            "string.min": "Password must be at least 5 characters long",
            "string.pattern.base": "Password must be minimum of 5 character and include at least one UpperCase, one Lowercase, one number and a special character [!@#$%^&*].",
        }),
        bloodType: Joi.string()
        .required()
        .trim()
        .messages({
            "any.required": 'bloodType is required',
            "string.empty": "bloodType cannot be empty"
        }),
        location: Joi.string()
        .required()
        .trim()
        .min(3)
        .messages({
            "any.required": 'location is required',
            "string.empty": "location cannot be empty",
            "string.min": "location must be at least 3 characters long"

        }),
        age: Joi.string()
        .required()
        .trim()
        .messages({
            "any.required": 'age is required',
            "string.empty": "age cannot be empty"
        })
    })
    const result = schema.validate(req.body, {abortEarly: false})
    console.log(result)
    next();  
};

exports.loginValidator = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().email().required().messages({
            "any.required": "Email is required",
            "string.email": "Invalid email address"
        }),
        password: Joi.string().required().messages({
            "any.required": "Password is required",
            "string.empty": "Password cannot be empty"
        })
    });

    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
        const errors = error.details.map(detail => detail.message);
        return res.status(400).json({ errors });
    }

    next();
};