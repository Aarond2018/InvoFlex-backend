const express = require("express");

const userController = require("../controllers/user-controller");
const validatorObj = require("../util/validator");
const handleValidation = require("../middlewares/handleValidation");
const AuthCheck = require("../middlewares/AuthCheck");
const upload = require("../util/multer")

const router = express.Router();

router.patch(
  "/completeOnboarding",
  AuthCheck,
  upload.single('logo'),
  validatorObj.completeUserReg,
  handleValidation,
  userController.completeUserReg
);
router.patch(
  "/resetPassword/:resetToken",
  validatorObj.passwordReset,
  handleValidation,
  userController.resetPassword
);
router.patch(
  "/updatePassword",
  AuthCheck,
  validatorObj.passwordUpdate,
  handleValidation,
  userController.updatePassword
);

module.exports = router;
