const express = require("express");

const authController = require("../controllers/auth-controller");
const validatorObj = require("../util/validator")
const handleValidation = require("../middlewares/handleValidation")

const router = express.Router();

router.post(
  "/signup", validatorObj.signUpValidation, handleValidation, authController.signup
);

router.post(
  "/signin", validatorObj.signInValidation, handleValidation, authController.signin
);

router.post("/forgot-password", validatorObj.forgotPasswordValidation, handleValidation, authController.forgotPassword)

module.exports = router;
