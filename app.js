const express = require("express")
const morgan = require("morgan")

const app = express()

if(process.env.NODE_ENV === "development") {
  app.use(morgan("dev"))
}

app.use(express.json())

app.use((req, res, next) => {
  console.log("hello from middleware")
  next()
})

app.get("/", (req, res) => {
  res.send("<h1>Hello World!</h1>")
})

module.exports = app