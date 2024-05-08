const mongoose = require("mongoose");

const Invoice = require("../models/InvoiceModel");
const User = require("../models/UserModel");
const Client = require("../models/ClientModel")
const AppError = require("../util/AppError");

exports.getInvoices = async (req, res, next) => {
  try {
    //get all invoices for the logged in user
    const invoices = await Invoice.find({ createdBy: req.userId }).populate("addressedTo")

    res.status(200).json({
      status: "success",
      data: invoices
    })

  } catch (error) {
    return next(new AppError("Something went wrong!"))
  }
}

exports.createInvoice = async (req, res, next) => {
  try {
    const {
      status,
      addressedTo,
      description,
      dueDate,
      note,
      totalAmount,
      items,
      taxApplied,
      paymentDetails,
    } = req.body;

    const client = await Client.findById(addressedTo)

    if(!client) {
      return next(new AppError("The addressed client can't be found, Create one!", 404))
    }

    const user = await User.findById(req.userId)

    if(!user) {
      return next(new AppError("Could not find the corresponding user", 404))
    }

    const newInvoice = new Invoice({
      status,
      createdBy: req.userId,
      addressedTo,
      description,
      dueDate: Date.parse(dueDate),
      note,
      totalAmount,
      items,
      taxApplied,
      paymentDetails
    })

    const session = await mongoose.startSession()
    session.startTransaction()

    await newInvoice.save({ session: session })
    user.invoices.push(newInvoice._id)
    await user.save({ session: session })

    await session.commitTransaction()

    res.status(201).json({
      status: "success",
      data: newInvoice
    })

  } catch (error) {
    return next(new AppError("Error creating invoice!", 500));
  }
};

exports.getSingleInvoice = async (req, res, next) => {
  try {
    const invoice = await Invoice.findById(req.params.invoiceId).populate("addressedTo")

    if(!invoice) {
      return next(new AppError("Can't find invoice with the given id", 404))
    }

    res.status(200).json({
      status: "success",
      data: invoice
    })

  } catch (error) {
    return next(new AppError("Error fetching invoice!", 500))
  }
}

exports.deleteInvoice = async (req, res, next) => {
  try {
    //get the invoice
    const invoice = await Invoice.findById(req.params.invoiceId)

    if(!invoice) {
      return next(new AppError("Can't find invoice with the given id", 404))
    }

    //get the logged in user
    const user = await User.findById(req.userId)

    if(!user) {
      return next(new AppError("Could not find the corresponding user", 404))
    }

    //return an error if the user trying to delete is not the owner of the invoice
    if(user._id.toString() !== invoice.createdBy.toString()) {
      return next(new AppError("You are not authorized to delete this invoice", 401))
    }

    //delete the invoice and also delete its ID on the user model
    const session = await mongoose.startSession()
    session.startTransaction()

    await Invoice.deleteOne({ _id: invoice._id }, { session: session })
    user.invoices.pull(invoice._id)
    await user.save( {session: session} )

    await session.commitTransaction()

    res.status(204).json({
      status: "success"
    })

  } catch (error) {
    return next(new AppError("Could not delete invoice", 500))
  }
}
