const fs = require("fs")

const mongoose = require("mongoose");

const Invoice = require("../models/InvoiceModel");
const User = require("../models/UserModel");
const Client = require("../models/ClientModel")
const AppError = require("../util/AppError");
const createInvoicePDF = require("../util/createInvoicePDF")
const { sendInvoiceMail } = require("../util/email")

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

    //if status is sent, send invoice immediately after creating
    if(status === "SENT") {
      //had to refetch invoice here, because of the population
      const invoice = await Invoice.findById(newInvoice._id).populate("createdBy").populate("addressedTo")

      try{
        await createInvoicePDF(invoice)
      } catch (error) {
        return next(new AppError("Error generating invoice", 500))
      }

      try {
        await sendInvoiceMail(invoice)
      } catch (error) {
        return next(new AppError("Error sending mail", 500))
      }

      fs.unlink(`${__dirname}/../invoices/${invoice._id}.pdf`, (err) => {
        if (err) {
          console.error('Error deleting file:', err);
        }
      })
    }

    res.status(201).json({
      status: "success",
      data: newInvoice
    })

  } catch (error) {
    console.log(error)
    return next(new AppError("Error creating invoice!", 500));
  }
};

exports.getSingleInvoice = async (req, res, next) => {
  try {
    const invoice = await Invoice.findById(req.params.invoiceId).populate("addressedTo").populate("createdBy")

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

exports.updateInvoice = async (req, res, next) => {
  //expects the full invoice object just like during invoice creation
  try {
    const {
      addressedTo,
      description,
      dueDate,
      note,
      totalAmount,
      items,
      taxApplied,
      paymentDetails,
    } = req.body;

    //extract the invoice with the specified id
    const invoice = await Invoice.findById(req.params.invoiceId)

    if(!invoice) {
      return next("Could not find an invoice with the provided id", 404)
    }

    //return an error if the user trying to update is not the owner of the invoice
    if(req.userId.toString() !== invoice.createdBy.toString()) {
      return next("You're not allowed to delete this invoice", 401)
    }

    invoice.addressedTo = addressedTo
    invoice.description = description
    invoice.dueDate = Date.parse(dueDate),
    invoice.note = note
    invoice.totalAmount = totalAmount
    invoice.items = items
    invoice.taxApplied = taxApplied
    invoice.paymentDetails = paymentDetails
    
    await invoice.save({
      runValidators: true
    })

    res.status(200).json({
      status: "success",
      data: invoice
    })

  } catch (error) {
    return next(new AppError("Could not update invoice", 500))
  }
}

exports.changeStatus = async (req, res, next) => {
  try {
    const { status } = req.body
    
     //extract the invoice with the specified id
     const invoice = await Invoice.findById(req.params.invoiceId)

     if(!invoice) {
       return next("Could not find an invoice with the provided id", 404)
     }

     //return an error if the user trying to change status is not the owner of the invoice
    if(req.userId.toString() !== invoice.createdBy.toString()) {
      return next("You're not allowed to update this invoice", 401)
    }

    //change the status and save
    invoice.status = status.toUpperCase()

    await invoice.save()

    res.status(200).json({
      status: "success",
      message: `Invoice status changed to ${status.toUpperCase()} successfully `
    }) 

  } catch (error) {
    return next(new AppError("Could not change invoice status", 500))
  }
}

exports.sendInvoice = async (req, res, next) =>{
  try {
    //extract the invoice with the specified id
    const invoice = await Invoice.findById(req.params.invoiceId).populate("createdBy").populate("addressedTo")

    if(!invoice) {
      return next("Could not find an invoice with the provided id", 404)
    }

    try{
      await createInvoicePDF(invoice)
    } catch (error) {
      return next(new AppError("Error generating invoice", 500))
    }

    try {
      await sendInvoiceMail(invoice)
    } catch (error) {
      return next(new AppError("Error sending mail", 500))
    }

    fs.unlink(`${__dirname}/../invoices/${invoice._id}.pdf`, (err) => {
      if (err) {
        console.error('Error deleting file:', err);
        
      }
      res.status(200).json({
        status: "success",
        message: "Invoice sent!"
      })
    })

  } catch (error) {
    return next(new AppError("Something went wrong", 500))
  }
}