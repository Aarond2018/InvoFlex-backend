const mongoose = require("mongoose")

require('dotenv').config()
const app = require("./app")

mongoose.connect(process.env.MONGODB_URI).then(() => {
  console.log("DB Connected Sucessfully!")
}).catch((error) => {
  console.error('Error connecting to MongoDB:', error);
})

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`App running on port ${8000}`) 
})