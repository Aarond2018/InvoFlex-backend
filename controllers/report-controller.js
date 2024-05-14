const Invoice = require("../models/InvoiceModel");
const AppError = require("../util/AppError");

exports.fetchReport = async (req, res, next) => {
  try {
    const { status, client: addressedTo, dateFrom, dateTo } = req.body;

    const invoices = await Invoice.find({
      status: status.toUpperCase(),
      addressedTo,
      createdAt: { $gte: dateFrom, $lte: dateTo },
    })

    res.status(200).json({
      status: "success",
      data: invoices
    })

  } catch (error) {
    return next(new AppError("Something went wrong!", 500));
  }
};
