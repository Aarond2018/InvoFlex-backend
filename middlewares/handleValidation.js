const { validationResult } = require("express-validator")
const AppError = require("../util/AppError")

const handleValidation = (req, res, next) => {
  //get input validation errors

  const validationErrors = validationResult(req);

  if(!validationErrors.isEmpty()){
    let errorMsgString = ""

    validationErrors.array().forEach( value => errorMsgString = `${errorMsgString} ${value.msg},`)

    next(new AppError(errorMsgString, 422))
  }

  next()
}

module.exports = handleValidation