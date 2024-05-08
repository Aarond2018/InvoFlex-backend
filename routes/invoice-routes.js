const express = require("express");

const {
  createInvoice,
  getInvoices,
  getSingleInvoice,
  deleteInvoice,
} = require("../controllers/invoice-controller");
const AuthCheck = require("../middlewares/AuthCheck");
const validatorObj = require("../util/validator");
const handleValidation = require("../middlewares/handleValidation");

const router = express.Router();

router
  .route("/")
  .get(AuthCheck, getInvoices)
  .post(AuthCheck, validatorObj.createInvoice, handleValidation, createInvoice);

router
  .route("/:invoiceId")
  .get(AuthCheck, getSingleInvoice)
  .delete(AuthCheck, deleteInvoice);

module.exports = router;
