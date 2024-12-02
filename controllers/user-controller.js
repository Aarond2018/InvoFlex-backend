const crypto = require("crypto");
const User = require("../models/UserModel");
const AppError = require("../util/AppError");
const getDataURI = require("../util/getDataURI");
const cloudinary = require("../util/cloudinary");

exports.getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId)

    if(!user) {
      return next(new AppError("No user found", 404))
    }

    return res.status(200).json({
      status: "success",
      message: "User fetched successfully!",
      data: user
    })

  } catch(error) {
    return next(
      new AppError(
        error.message ? error.message : "Internal Server Error!",
        500
      )
    );
  } 
}

exports.resetPassword = async (req, res, next) => {
  try {
    const resetToken = req.params.resetToken;

    const { password } = req.body;

    //hash the retrieved reset token
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    //check if it is the same for the resetToken for any of the user in the database
    const user = await User.findOne({
      resetToken: hashedToken,
      resetTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      return next(new AppError("Token is invalid or has expired", 400));
    }

    //update and save the new password
    user.password = password;
    user.resetToken = undefined;
    user.resetTokenExpires = undefined;

    await user.save();

    res.status(200).json({
      status: "success",
      message: "Password reset successfully! Sign in.",
    });
  } catch (error) {
    return next(
      new AppError(
        error.message ? error.message : "Internal Server Error!",
        500
      )
    );
  }
};

exports.updatePassword = async (req, res, next) => {
  try {
    const { password, newPassword } = req.body;

    const user = await User.findById(req.userId).select("+password");

    //check if the password entered matches what is in the database
    if (!(await user.comparePassword(password, user.password))) {
      return next(new AppError("The entered password is wrong", 401));
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      status: "success",
      message: "Password updated successfully!",
    });
  } catch (error) {
    return next(
      new AppError(
        error.message ? error.message : "Internal Server Error!",
        500
      )
    );
  }
};

exports.completeUserReg = async (req, res, next) => {
  try {
    const { businessName, address, phone } = req.body;

    let cloudinaryUrl;

    //upload logo to Cloudinary
    try {
      if (req.file) {
        const logoURI = getDataURI(req.file);
        const cloudinaryRes = await cloudinary.uploader.upload(logoURI, {
          folder: "invoflex",
        });

        cloudinaryUrl = cloudinaryRes.secure_url;
      }
    } catch (error) {
      console.log(error);
      return next(new AppError("Error uploading file", 400));
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      {
        businessName,
        address,
        phone,
        logo: cloudinaryUrl || null,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      status: "success",
      data: updatedUser,
    });
  } catch (error) {
    return next(
      new AppError(
        error.message ? error.message : "Internal Server Error!",
        500
      )
    );
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const { name, businessName, address, phone } = req.body

    const user = await User.findById(req.userId)

    if(!user) {
      return next(new AppError("No user found", 404))
    }

    let cloudinaryUrl;

    //upload logo to Cloudinary
    try {
      if (req.file) {
        const logoURI = getDataURI(req.file);
        const cloudinaryRes = await cloudinary.uploader.upload(logoURI, {
          folder: "invoflex",
        });

        cloudinaryUrl = cloudinaryRes.secure_url;
      }
    } catch (error) {
      console.log(error);
      return next(new AppError("Error uploading file", 400));
    }

    user.name = name
    user.businessName = businessName
    user.address = address
    user.phone = phone
    user.logo = cloudinaryUrl || null
    
    await user.save()

    return res.status(200).json({
      status: "success",
      message: "Updated successfully!",
      data: user
    })

  } catch(error) {
    return next(
      new AppError(
        error.message ? error.message : "Internal Server Error!",
        500
      )
    );
  }
}