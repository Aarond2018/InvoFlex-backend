const { check } = require("express-validator");

exports.signUpValidation = [
  check("name", "Name field can not be empty").not().isEmpty(),
  check("email", "Email can't be empty").not().isEmpty(),
  check("email", "Provide a valid email").isEmail(),
  check("password", "Passwprd can't be empty").not().isEmpty(),
  check("password", "Password should have a minimum of 8 characters").isLength({min: 8})
]

exports.signInValidation = [
  check("email", "Email can't be empty").not().isEmpty(),
  check("email", "Provide a valid email").isEmail(),
  check("password", "Password can't be empty").not().isEmpty(),
  check("password", "Password should have a minimum of 8 characters").isLength({min: 8})
]

exports.forgotPasswordValidation = [
  check("email", "Email can't be empty").not().isEmpty(),
  check("email", "Provide a valid email").isEmail(),
]

exports.passwordReset = [
  check("password", "Password can't be empty").not().isEmpty(),
  check("password", "Password should have a minimum of 8 characters").isLength({min: 8})
]

exports.passwordUpdate = [
  check("password", "Password can't be empty").not().isEmpty(),
  check("password", "Password should have a minimum of 8 characters").isLength({min: 8}),
  check("newPassword", "New Password can't be empty").not().isEmpty(),
  check("newPassword", "New Password should have a minimum of 8 characters").isLength({min: 8})
]

exports.completeUserReg = [
  check("businessName", "Business name field can not be empty").not().isEmpty(),
  check("address", "Address field can not be empty").not().isEmpty(),
  check("phone", "Phone number can't be empty").not().isEmpty(),
  check("phone", "Phone number should have at least 11 characters").isLength({min: 11}),
]

exports.verifyOtp = [
  check("otp", "OTP can not be empty").not().isEmpty(),
]

exports.createClient = [
  check("name", "A Client name is required").not().isEmpty(),
  check("email", "Enter a valid Client email").isEmail(),
]

exports.createInvoice = [
  check("addressedTo", "Correspondent cient id is required").not().isEmpty(),
  check("description", "Provide a brief description").not().isEmpty(),
  check("dueDate", "A due date is required").not().isEmpty(),
  // check("dueDate", "Enter a valid date").isDate(),
  check("totalAmount", "Enter the total amount of the invoice").not().isEmpty(),
  check("items", "Provide the invoice item").not().isEmpty()
]

exports.changeStatus = [
  check("status", "A status value is required").not().isEmpty()
]