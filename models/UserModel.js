const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

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
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: [true, "A password is required"],
    minLength: 8,
    select: false
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  address: {
    type: String,
    // required: [true, "An address is required"],
    trim: true
  },
  logo: String ,
  clients: [{ type: mongoose.Schema.Types.ObjectId, ref: "Client"}],
  invoices: [{ type: mongoose.Schema.Types.ObjectId, ref: "Invoice" }]
}, { timestamps: true })

//mongoose middleware to hash the password before saving a document
userSchema.pre("save", async function(next) {
  //skip if the password is not modified, i.e other non password-related operations
  if(!this.isModified("password")) {
    return next()
  }

  //hash the password
  this.password = await bcrypt.hash(this.password, 12)
  
  next()
})

const User = mongoose.model("User", userSchema)
module.exports = User