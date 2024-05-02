const mongoose = require("mongoose")

const clientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A client name is required"]
  },
  email: String,
  address: {
    type: String,
    trim: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
})

const Client = mongoose.model("Client", clientSchema)
module.exports = ClientModel