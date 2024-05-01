const express = require("express")
const morgan = require("morgan")

const app = express()

if(process.env.NODE_ENV === "development") {
  app.use(morgan("dev"))
}

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    message: "Something went wrong!"
  })
})

module.exports = app