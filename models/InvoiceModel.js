const mongoose = require("mongoose")

const invoiceSchema = new mongoose.Schema({
  invoice_number: {
    type: String,
    required: [true, "An Invoice number is required"]
  },
  status: {
    type: String,
    enum: ["DRAFT", "SENT", "PAID", "OVERDUE"],
    default: "DRAFT"
  },
  description: {
    type: String,
    required: [true, "A brief description is required"]
  },
  note: String,
  createdAt: {
    type: Date,
    default: Date.now()
  },
  dueDate: {
    type: Date,
    required: [true, "An invoice must have a due date"]
  },
  amount: {
    type: Number,
    required: [true, "An amount is required"]
  },
  tax: {
    type: Number,
    required: [true, "An invoice must have a tax value"]
  },

})

//check what does { timestamps: true } do in he documentation

//relationship
//user and customer

const Invoice = mongoose.model("Invoice", invoiceSchema)
module.exports = Invoice