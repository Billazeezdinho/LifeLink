const { userModel } = require('../model/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


exports.register = async (req, res) => {
    try {
      //Extract required data from request body
      const { fullName, email, password } = req.body;
      const userExists = await userModel.findOne({ email: email.toLowerCase() });
      if (userExists){
        return res.status(400).json({
          message: `Email ${email} is already registered`,
        });
      }
      //Salt and hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      //Create user
      const user = new userModel({
        fullName: fullName.trim(),
        email: email.toLowerCase(),
        password: hashedPassword,
      });
      await user.save();

      res.status(201).json({
        message: "User created successfully",
        data: user,
      });
    } catch (error) {
      console.log(error.message);
      res.status(500).json({
        message: "Internal server error " + error.message,
      });
    }
  };

  exports.login = async (req, res)=>{
    try{
      const {email, password} = req.body;
      if(email == undefined || password == undefined){
        return res.status(400).json({
          message: 'Email and password required'
        })
      }
  
    const user = await userModel.findOne({email: email.toLowerCase() });
    if(user == null){
      return res.status(404).json({
        message: 'User Not Found'
      })
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password)
    if(isPasswordCorrect == false){
      return res.status(400).json({
        message: 'Incorrect Password'
      })
    }
    const token = await jwt.sign({ userId: user._id}, process.env.key, { expiresIn: "1d" });
    res.status(200).json({
      message: 'Logged In Successfully',
      data: user,
      token
    })
    }catch(error){
      console.log(error.message)
      res.status(500).json({
        message: 'Internal Server Error '+ error.message
      })
    }
  }