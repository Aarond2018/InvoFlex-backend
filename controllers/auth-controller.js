const jwt = require("jsonwebtoken")
const { validationResult } = require("express-validator")

const User = require("../models/UserModel");
const AppError = require("../util/AppError");

exports.signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body
    
    const existingUser = await User.findOne({ email })
  
    if(existingUser) {
      return next(new AppError("User already exists, Log in instead.", 409))
    }
  
    const newUser = new User({
      name,
      email,
      password,
      businessName: name,
    })

    await newUser.save()
  
    const token = jwt.sign({id: newUser._id}, process.env.JWT_SECRET, {
      expiresIn: "1d"
    })

    res.status(201).json({
      status: "success",
      token,
      data: newUser
    })

  } catch (error) {
    return next(new AppError(error.message ? error.message : "Internal Server Error!", 500))
  }
};
