const express = require("express");
const morgan = require("morgan");

const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  err.message = err.message || "Something went wrong!";

  if (process.env.NODE_ENV === "development") {
    res.status(statusCode).json({
      status: err.status,
      message: err.message,
      error: err,
      stack: err.stack,
    });
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };

    if (error.name && error.name === "CastError")
      error = new AppError(`Invalid ${error.path}: ${error.value}`, 400);
    if (error.code && error.code === "E11000")
      error = new AppError(`Duplicate input(s) entered, check inputs`, 400);
    if (error.name && error.name === "ValidationError") {
      const errorMessages = Object.values(error.errors).map((el) => el.message);
      error = new AppError(
        `Invalid input data: ${errorMessages.join(". ")}`,
        400
      );
    }

    res.status(statusCode).json({
      status: error.status,
      message: error.message,
    });
  }
});

module.exports = app;
