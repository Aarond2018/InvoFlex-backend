const crypto = require("crypto")
const User = require("../models/UserModel")
const AppError = require("../util/AppError")

exports.resetPassword = async (req, res, next) => {
  try {
    const resetToken = req.params.resetToken

    const { password } = req.body
    
    //hash the retrieved reset token
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex")

    //check if it is the same for the resetToken for any of the user in the database
    const user = await User.findOne({ 
      resetToken : hashedToken,
      resetTokenExpires: { $gt: Date.now() }
    })

    if(!user) {
      return next(new AppError("Token is invalid or has expired", 400))
    }

    //update and save the new password
    user.password = password
    user.resetToken = undefined
    user.resetTokenExpires = undefined

    await user.save()

    res.status(200).json({
      status: "success",
      message: "Password reset successfully! Sign in."
    })

  } catch (error) {
    return next(new AppError(error.message ? error.message : "Internal Server Error!", 500))
  }
}

exports.updatePassword = async (req, res, next) => {
  try {
    const { password, newPassword } = req.body

    const user = await User.findById({ _id: req.userId }).select("+password")

    //check if the password entered matches what is in the database
    if(!(await user.comparePassword(password, user.password))) {
      return next(new AppError("The entered password is wrong", 401))
    }

    user.password = newPassword
    await user.save()

    res.status(200).json({
      status: "success",
      message: "Password updated successfully!"
    })

  } catch (error) {
    return next(new AppError(error.message ? error.message : "Internal Server Error!", 500))
  }
}

exports.completeUserReg = async (req, res, next) => {
  try {
    const { businessName, address, phone } = req.body

    const updatedUser = await User.findByIdAndUpdate(req.userId, {
      businessName,
      address,
      phone
    }, {
      new: true,
      runValidators: true
    })

    res.status(200).json({
      status: "success",
      data: {
        user: updatedUser
      }
    })

  } catch (error) {
    return next(new AppError(error.message ? error.message : "Internal Server Error!", 500))
  }
}