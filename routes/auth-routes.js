const express = require("express");

const authControllers = require("../controllers/auth-controller");
const validatorObj = require("../util/validator")
const handleValidation = require("../middlewares/handleValidation")

const router = express.Router();

router.post(
  "/signup", validatorObj.signUpValidation, handleValidation, authControllers.signup
);

router.post(
  "/signin", validatorObj.signInValidation, handleValidation, authControllers.signin
);

router.post("/forgot-password", validatorObj.forgotPasswordValidation, handleValidation, authControllers.forgotPassword)

module.exports = router;
