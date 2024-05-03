const express = require("express");
const morgan = require("morgan");

const authRoutes = require("./routes/auth-routes")
const userRoutes = require("./routes/user-routes")
const AppError = require("./util/AppError")
const GlobalErrorHandler = require("./middlewares/GlobalErrorHandler")

const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/users", userRoutes)

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(GlobalErrorHandler);

module.exports = app;
