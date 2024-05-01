const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A name is required"]
  },
  businessName: {
    type: String,
    required: [true, "A business name is required"]
  },
  email: {
    type: String,
    required: [true, "A valid email is required"],
    unique: true
  },
  password: {
    type: String,
    required: [true, "A password is required"]
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  address: {
    type: String,
    required: [true, "An address is required"],
    trim: true
  },
  logo: String ,
  clients: [{ type: Schema.Types.ObjectId, ref: "Client"}],
  invoices: [{ type: Schema.Types.ObjectId, ref: "Invoice" }]
}, { timestamps: true })

const User = mongoose.model("User", userSchema)
module.exports = User