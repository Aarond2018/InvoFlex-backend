const express = require("express");

const userController = require("../controllers/user-controller")
// const validatorObj = require("../util/validator")
// const handleValidation = require("../middlewares/handleValidation")

const router = express.Router();

router.patch("/resetPassword/:resetToken", userController.resetPassword)

module.exports = router;
