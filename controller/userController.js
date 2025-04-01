const { userModel } = require('../model/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const key = process.env.key


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
      console.log(email)
      if(email == undefined || password == undefined){
        return res.status(400).json({
          message: 'Email and password required'
        })
      }
  
    const donor = await userModel.findOne({email: email.toLowerCase() });
    if(donor == null){
      return res.status(404).json({
        message: 'Donor Not Found'
      })
    }
    const isPasswordCorrect = await bcrypt.compare(password, donor.password)
    if(isPasswordCorrect == false){
      return res.status(400).json({
        message: 'Incorrect Password'
      })
    }
    const token = await jwt.sign({ userId: donor._id }, key, { expiresIn: "1d" });
    res.status(200).json({
      message: 'Donor Logged In Successfully',
      data: donor,
      token
    })
    }catch(error){
      console.log(error.message)
      res.status(500).json({
        message: 'Internal Server Error ' + error.message
      })
    }
  }