const jwt = require("jsonwebtoken")
const AppError = require("../util/AppError")

module.exports = async (req, res, next) => {
  try {
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1]
    }

    if(!token) {
      return next(new AppError("You're not signed in! Please sign in to gain access", 401))
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    req.userId = decoded.id
    
    next()
  } catch (error) {
    return next(new AppError("Authentication failed", 403))
  }
}