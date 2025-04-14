  const { donorModel } = require('../model/donorModel');
  const bcrypt = require('bcrypt');
  const jwt = require('jsonwebtoken');
  const resetMail = require("../utils/resetMail");
  const sendMail = require("../utils/email");
  const cloudinary = require('cloudinary');
  const welcomeMail = require('../utils/welcome')

const generatedToken = (id) => {
    return jwt.sign({ id}, process.env.key, { expiresIn: "1d" });
  }

exports.register = async (req, res) => {
      try {
        //Extract required data from request body
        const { fullName, email, password, bloodType, location, age  } = req.body;
        const userExists = await donorModel.findOne({ email: email.toLowerCase() });
        if (userExists){
          return res.status(400).json({
            message: `Email ${email} is already registered`,
          });
        }
        //Salt and hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
    
        //Create user
        const donor = new donorModel({
          fullName: fullName.trim(),
          email: req.body.email?.toLowerCase(),
          password: hashedPassword,
          bloodType,
          location, 
          age
        });
        
        const firstName = donor.fullName.split(" ")[0];
        const mailDetails = {
        email: donor.email,
        subject: "Welcome to LIFELINK",
        html: welcomeMail(firstName),
      };
      await donor.save();
      await sendMail(mailDetails);
        res.status(201).json({
          message: "Donor created successfully",
          data: donor,
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
    
      const donor = await donorModel.findOne({email: email.toLowerCase() });
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
      const token = generatedToken(donor._id);
      res.status(200).json({
        message: 'Logged In Successfully',
        data: donor,
        token
      })
      }catch(error){
        console.log(error.message)
        res.status(500).json({
          message: 'Internal Server Error '+ error.message
        })
      }
    }

exports.getAllDonor = async (req, res) =>{
      try{
        const donors = await donorModel.find();
      res.status(200).json({
        message: "All Donor's in the database",
        data: donors,
        total: donors.length
      })}
      catch(error){
        console.log(error.message);
        res.status(500).json({
          message: 'Internal Server Error' + error.message
        })
        
      }
    
    }
  exports.getOneDonorById = async (req, res)=>{
    try {
      const donor = await donorModel.findById(req.params.id);
      if(!donor){
        return res.status(404).json({
          message:'donor not found'
        })
      }
      
      res.status(200).json({
        message: 'Donor fetched successfully',
        data: donor
      })

    } catch (error) {
      res.status(500).json({
        message:'Internal Server Error' + error.message
      })
      
    }
  }
exports.getDashboard = async (req, res) => {
    try {
      const token =generatedToken(req.user._id);
      console.log(token)
      if (!token){
        return res.status(400).json({
          message: 'unable to generate token'
        });
      }
      console.log(req.user);
      
      res.status(200).json({
        message: req.user,
        token
      })
    } catch (error) {
      res.status(500).json({
        message: 'Internal Server Error' + error.message 
      })
    }
}
  exports.scheduleDonation = async (req, res)=> {
    try {
      const {date, hospitalId} = req.body;
      if (!date || !hospitalId ){
        return res.status(400).json({
          message: 'Date and hospital are required'
        })
      }
      const updated = await donorModel.findByIdAndUpdate(req.donor._id, { status: 'pending'}, {new: true});
      const token = generatedToken(updated._id);
      res.status(201).json({
        message: "donation appointment scheduled",
        token
      })
    } catch (error) {
      res.status(500).json({
        message: 'Internal Server Error' + error.message
      })
    }
  }
  exports.getDonationsByStatus = async (req, res) => {
    try {
      const { status } = req.params;
      const donor = await donorModel.findById(req.user._id);
      if(!donor){
        return res.status(404).json({
          message: "Donor Not Found "
        })
      }
      if(donor.status !== status){
        return res.status(404).json({
          message: `No ${status} donations found`
        })
      }
      const token = generatedToken(donor._id)
      res.status(200).json({
        status: donor.status,
        token
      })
      
    } catch (error) {
      res.status(500).json({
        message: "internal Server Error" + error.message
      })
      
    }
  }
  exports.logOut = async (req, res)=>{
    try {
      const token = req.headers.authorization?.split(' ')[1];
      let cancelToken = new Set();
      if(token){
        cancelToken.add(token);
      };
      res.status(200).json({
        message: 'Logged Out Successfully'
      })
    } catch (error) {
      res.status(500).json({
        message:'Internal Server Error' + error.message
      })
    }
  }
  exports.updateProfile= async (req, res)=>{
    try {
      const updateFields = req.body;
      if(req.file){
        const result = await cloudinary.uploader.upload(req.file.path)
        updateFields.profilepics = result.secure_url;
      }
      const updatedDonor = await donorModel.findByIdAndUpdate(req.user._id, updateFields, {new:true});
      const token = generatedToken(updatedDonor._id);
      
    
    
    // Send a success response
    res.status(201).json({
      message: 'profile picture uploaded successfully',
      token
  });

  } catch (error) {
    // Unlink the file from our local storage
      fs.unlinkSync(req.file.path);   
      res.status(500).json({
        message: 'Internal Server Error' + error.message
      })
      
    }
  }
  exports.forgotPassword = async (req, res)=>{
      try{
          const { email } = req.body;
          const checkEmail = await donorModel.findOne({email})
          if(!checkEmail){
              return res.status(404).json({
                  message: 'Email not found'
              })
          }
          const token = jwt.sign({id:checkEmail._id}, "secret_key", {expiresIn: '20min'})
          const link = `${req.protocol}://${req.get('host')}/resetPassword/${token}`
          const subject = "Reset Password" + " " + checkEmail.fullName;
          const text = `Reset Password ${checkEmail.fullName}, kindly use this link to reset your password ${link} `;
          sendMail({subject:subject, email:checkEmail.email, html:resetMail(link, checkEmail.fullName)})
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
          const checkdonor = await donorModel.findById(req.params.id)
          if(!checkdonor){
              return res.status(404).json({
                  message: 'Donor not found'
              })
          }
          const salt = await bcrypt.genSaltSync(10);
          const hash = await bcrypt.hashSync(newPassword, salt);
        
          await donorModel.findByIdAndUpdate(req.params.id, {password:hash})
          
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
          const checkdonor = await donorModel.findById( id )
          if(!checkdonor){
              return res.status(404).json({
                  message: 'Donor not found'
              })
          }
          

          const salt = await bcrypt.genSaltSync(10);
          const hashedPassword = await bcrypt.hashSync(newPassword, salt);
          const findDonor = await donorModel.findByIdAndUpdate(id, {password: hashedPassword})
          
          if(!findDonor){
              return res.status(400).json({
                  message: 'Failed to change password'
              })

          }
          res.status(200).json({
              message: 'Password changed successfully'
          })
      }catch(error){
          res.status(500).json({
              message: "internal server error" + error.message
          })
      }
  }
  exports.deleteDonor = async (req, res) =>{
    try {
      const donor = await donorModel.findByIdAndDelete(req.params.id);
      if(!donor) {
        return res.status(404).json({
          message: 'Donor not found'
        })
      } res.status(200).json({
        message: 'Donor Deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        message:'Internal Server Error' + error.message
      })
      
    }
  }
  exports.viewHospitals = async (req, res) => {
    try {
      // Fetch hospitals list
      const hospitals = await Hospital.find();
      res.status(200).json(hospitals);
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  };

  exports.bookAppointment = async (req, res) => {
    const { hospitalId, date, time } = req.body;
    
    try {
      const appointment = new Appointment({
        donor: req.user.id,
        hospital: hospitalId,
        date,
        time,
      });
      await appointment.save();
      
      // Send email notification to the hospital
      sendEmail(
        'hospital-email@example.com',
        'Appointment Request',
        `A donor wants to book an appointment with you. Please log into the Lifelink app to read, add, confirm, or reschedule.`
      );

      res.status(200).json({ message: 'Appointment booked successfully' });
    } catch (err) {
      res.status(500).json({ message: 'Error booking appointment' });
    }
  };

  exports.deleteDonor = async (req, res) => {
    try {
      const donor = await donorModel.findByIdAndDelete(req.params.id);
      if(!donor){
        return res.status(404).json({
          message: 'Donor not found'
        });
      }
      res.status(200).json({
        message: 'Donor deleted Successfully'
      })
    } catch (error) {
      res.status(500).json({
        message: 'Internal Server Error' + error.message
      })
    }
  }

