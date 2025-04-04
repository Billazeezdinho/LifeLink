const { userModel } = require('../model/donorModel');
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

  exports.getAll = async (req, res) =>{
    try{
      const users = await userModel.find();
    res.status(200).json({
      message: "All Donor's in the database",
      data: users
    })}
    catch(error){
      console.log(error.message);
      res.status(500).json({
        message: 'Internal Server Error' + error.message
      })
      
    }
  
  }

  exports.resetPassword = async (req, res)=>{
    try{
        const { email } = req.body;
        const checkEmail = await userModel.findOne({email})
        if(!checkEmail){
            return res.status(404).json({
                message: 'Email not found'
            })
        }
        const token = jwt.sign({id:checkEmail._id}, "secret_key", {expiresIn: '10min'})
        const link = `${req.protocol}://${req.get('host')}/resetPassword/${checkEmail._id}/${token}`
        const subject = "Reset Password" + " " + checkEmail.fullName;
        const text = `Reset Password ${checkEmail.fullName}, kindly use this link to reset your password ${link} `;
         sendMail({subject:subject, email:checkEmail.email, html:signup(link, checkEmail.fullName)})
         res.status(200).json({
            message: 'Reset password link sent successfully'
        })
                        

    }catch(error){
        res.status(500).json({
            message: error.message
        })
    }
}

exports.resetNewPassword = async (req, res) =>{
    try{
        const {newPassword} = req.body;
        const checkUser = await schoolModel.findById(req.params.id)
        if(!checkUser){
            return res.status(404).json({
                message: 'User not found'
            })
        }
        const salt = await bcrypt.genSaltSync(10);
        const hash = await bcrypt.hashSync(newPassword, salt);
       
        await schoolModel.findByIdAndUpdate(req.params.id, {password:hash})
        
        res.status(200).json({
            message: 'Password change Successfully'
        })

    }catch(error){
        res.status(500).json({
            message: error.message
        })
    }
}

exports.changePassword = async (req, res) =>{
    try{
        const { id, newPassword } = req.body;
        const checkSchool = await schoolModel.findById( id )
        if(!checkSchool){
            return res.status(404).json({
                message: 'School not found'
            })
        }
        

        const salt = await bcrypt.genSaltSync(10);
        const hashedPassword = await bcrypt.hashSync(newPassword, salt);
        const findSchool = await schoolModel.findByIdAndUpdate(id, {password: hashedPassword})
        
        if(!findSchool){
            return res.status(400).json({
                message: 'Failed to change password'
            })

        }
        res.status(200).json({
            message: 'Password changed successfully'
        })
    }catch(error){
        res.status(500).json({
            message: error.message
        })
    }
}