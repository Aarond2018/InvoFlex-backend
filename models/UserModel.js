const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A business name is required"]
  },
  address: {
    type: String,
    required: [true, "An address is required"]
  },
  email: {
    type: String,
    required: [true, "A valid email is required"]
  },
  postalCode: {
    type: Number,
  },
  image: String 
})

//relationship

const User = mongoose.model("User", userSchema)
module.exports = User