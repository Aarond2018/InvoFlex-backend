const mongoose = require("mongoose")
const Invoice = require("../models/InvoiceModel")
const Client = require("../models/ClientModel")
const AppError = require("../util/AppError");

exports.dashboardOverview = async (req, res, next) => {
  try {
    // Fetch total number of invoices for the user
    const totalInvoices = await Invoice.countDocuments({ createdBy: req.userId });

    // Fetch total amount invoiced for the user
      const totalAmountResult = await Invoice.aggregate([
        { $match: { createdBy: new mongoose.Types.ObjectId(req.userId) } },
        {
          $group: {
            _id: null,
            total: { $sum: '$totalAmount' },
          },
        },
      ]);  

    // Fetch total number of clients for the user
    const totalClients = await Client.countDocuments({ user: req.userId });

    // Fetch recent invoices for the user (example: last 5 invoices)
    const recentInvoices = await Invoice.find({ createdBy: req.userId })
      .sort({ createdAt: -1 })
      .limit(5);

    // Prepare the dashboard data
    const dashboardData = {
      totalInvoices,
      totalAmount: totalAmountResult[0]?.total || 0,
      totalClients,
      recentInvoices,
    };

    res.status(200).json({
      status: "success",
      data: dashboardData
    })

  } catch(error) {
    return next(new AppError("Something went wrong!", 500))
  }
}