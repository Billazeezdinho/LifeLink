const { userModel } = require('../model/user');
const bcrypt = require('bcrypt');


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