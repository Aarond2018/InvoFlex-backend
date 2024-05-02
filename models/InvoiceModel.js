const mongoose = require("mongoose")

const invoiceSchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ["DRAFT", "SENT", "PAID", "OVERDUE"],
    default: "DRAFT"
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  addressedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client"
  },
  description: {
    type: String,
    required: [true, "A brief description is required"],
    trim: true
  },
  dueDate: {
    type: Date,
    required: [true, "An invoice must have a due date"]
  },
  note: {
    type: String,
    trim: true
  },
  totalAmount: {
    type: Number,
    required: [true, "A total is required"]
  },
  items: [
    {
      description: {
        type: String,
        required: true
      },
      rate: {
        type: Number,
        required: true,
      },
      quantity: {
        type: Number,
        default: 1
      }
    }
  ],
  tax: {
    type: Number,
    default: 0
  },
  paymentDetails: {
    accName: String,
    accNumber: Number,
    bankName: String
  }
}, { timestamps: true })

const Invoice = mongoose.model("Invoice", invoiceSchema)
module.exports = Invoice