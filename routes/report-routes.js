const express = require("express")
const { fetchReport } = require("../controllers/report-controller")
const AuthCheck = require("../middlewares/AuthCheck")

const router = express.Router()

router.post("/", AuthCheck, fetchReport)

module.exports = router