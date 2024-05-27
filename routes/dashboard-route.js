const express = require("express");
const AuthCheck = require("../middlewares/AuthCheck");
const { dashboardOverview } = require("../controllers/dashboard-controller");

const router = express.Router();

router.get("/overview", AuthCheck, dashboardOverview);

module.exports = router;
