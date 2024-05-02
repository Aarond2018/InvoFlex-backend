const { check } = require("express-validator");

exports.signUpValidation = [
  check("name", "Name field can not be empty").not().isEmpty(),
  check("email", "Email can't be empty").not().isEmpty(),
  check("email", "Provide a valid email").isEmail(),
  check("password", "Passwprd can't be empty").not().isEmpty(),
  check("password", "Password should have a minimum of 8 characters").isLength({min: 8})
]