const Invoice = require("../models/InvoiceModel");
const AppError = require("../util/AppError");

exports.fetchReport = async (req, res, next) => {
  try {
    const { status, addressedTo, dateFrom, dateTo } = req.body;

    // Validate and convert dates
    const startDate = dateFrom ? new Date(dateFrom) : new Date("1970-01-01");
    const endDate = dateTo ? new Date(dateTo) : new Date();

    if (isNaN(startDate) || isNaN(endDate)) {
      return next(new AppError("Invalid date format!", 400));
    }

    //query object
    const queryObj = {
      createdAt: { $gte: startDate, $lte: endDate },
    };

    // add status to query if provided
    if (status) {
      queryObj.status = status.toUpperCase();
    }

    // Add addressedTo to query if provided
    if (addressedTo) {
      queryObj.addressedTo = addressedTo;
    }

    const invoices = await Invoice.find(queryObj);

    res.status(200).json({
      status: "success",
      data: invoices,
    });
  } catch (error) {
    return next(new AppError("Something went wrong!", 500));
  }
};
