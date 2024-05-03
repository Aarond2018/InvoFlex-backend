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
      message: "Password reset successfully!"
    })

  } catch (error) {
    return next(new AppError(error.message ? error.message : "Internal Server Error!", 500))
  }
}