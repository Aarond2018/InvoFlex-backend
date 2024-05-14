const AppError = require("../util/AppError")

exports.fetchReport = async (req, res) => {
  try {


  } catch (error) {
    return next(new AppError("Something went wrong!", 500))
  }
}