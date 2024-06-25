const express = require("express");

const authController = require("../controllers/auth-controller");
const validatorObj = require("../util/validator")
const handleValidation = require("../middlewares/handleValidation")
const AuthCheck = require("../middlewares/AuthCheck")

const router = express.Router();

router.post(
  "/signup", validatorObj.signUpValidation, handleValidation, authController.signup
);

router.post(
  "/signin", validatorObj.signInValidation, handleValidation, authController.signin
);

router.post("/forgot-password", validatorObj.forgotPasswordValidation, handleValidation, authController.forgotPassword)

router.post("/sendOtp", AuthCheck, authController.sendOtp)
router.post("/verifyOtp", AuthCheck, validatorObj.verifyOtp, handleValidation, authController.verifyOtp)

module.exports = router;
