const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const crypto = require("crypto")

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
  invoices: [{ type: mongoose.Schema.Types.ObjectId, ref: "Invoice" }],
  resetToken: String,
  resetTokenExpires: Date

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

userSchema.methods.comparePassword = async function(enteredPassword, userPassword) {
  return await bcrypt.compare(enteredPassword, userPassword)
}

userSchema.methods.createPasswordResetToken = function() {
  //generate the token with the crypto package
  const resetToken = crypto.randomBytes(32).toString("hex")

  //hash the token and add it to the model, as well as the expiry time
  this.resetToken = crypto.createHash("sha256").update(resetToken).digest("hex")
  this.resetTokenExpires = Date.now() + 10 * 60 * 1000

  //return the unhashed token
  return resetToken;
}

const User = mongoose.model("User", userSchema)
module.exports = User