const express = require("express");

const {
  createClient,
  getClients,
  updateClient,
  deleteClient,
} = require("../controllers/client-controller");
const AuthCheck = require("../middlewares/AuthCheck");
const validatorObj = require("../util/validator");
const handleValidation = require("../middlewares/handleValidation");

const router = express.Router();

router
  .route("/")
  .get(AuthCheck, getClients)
  .post(AuthCheck, validatorObj.createClient, handleValidation, createClient);

router
  .route("/:clientId")
  .put(AuthCheck, validatorObj.createClient, handleValidation, updateClient)
  .delete(AuthCheck, deleteClient);

module.exports = router;
