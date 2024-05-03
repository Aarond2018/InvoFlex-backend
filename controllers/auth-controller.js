const jwt = require("jsonwebtoken")

const User = require("../models/UserModel");
const AppError = require("../util/AppError");
const sendEmail = require("../util/email")

exports.signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body
    
    //check if user already exist
    const existingUser = await User.findOne({ email })
    
    if(existingUser) {
      return next(new AppError("User already exists, Log in instead.", 409))
    }

    //create new user
    const newUser = new User({
      name,
      email,
      password,
      businessName: name,
    })

    await newUser.save()
    
    //generate token
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

exports.signin = async (req, res, next) => {
  try {
    const { email, password } = req.body

    //get user with the password inclusive
    const user = await User.findOne({ email }).select("+password")

    //return an error if no user and if password does not match
    if(!user || !(await user.comparePassword(password, user.password))) {
      return next(new AppError("Incorrect email or password", 401))
    }

    //generate token
    const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {
      expiresIn: "1d"
    })

    res.status(200).json({
      status: "success",
      token
    })

  } catch (error) {
    return next(new AppError(error.message ? error.message : "Signing in failed, Please try again later!", 500))
  }
}

exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email })

    if(!user) {
      return next(new AppError("Can't find user for the given email", 404))
    }

    //generate the token
    const resetToken = user.createPasswordResetToken()
    await user.save( {validateBeforeSave: false})

    //generate the  reset URL - backend endpoint, will be changed to the frontend URL later
    const resetLink = `${req.protocol}://${req.get("host")}/api/v1/users/resetPassword/${resetToken}`
    
    //send reset link to the provided email address
    try {
      await sendEmail({
        email: user.email,
        subject: "Reset your Password",
        message: `Your password reset link:\n ${resetLink}`
      })
      
      res.status(200).json({
        status: "success",
        message: "Token sent to the given email!"
      })
    } catch (error) {
      return new AppError("Error sending the email, Try again!", 500)
    }

  } catch (error) {
    return next(new AppError(error.message ? error.message : "Internal Server Error!", 500))
  }
}