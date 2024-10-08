const mongoose = require("mongoose")

const otpSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  expires: {
    type: Date,
    required: true
  }
})

const OTP = mongoose.model("OTP", otpSchema)
module.exports = OTP