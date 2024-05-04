const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet")
const rateLimit = require("express-rate-limit")
const mongoSanitize = require("express-mongo-sanitize")

const authRoutes = require("./routes/auth-routes")
const userRoutes = require("./routes/user-routes")
const AppError = require("./util/AppError")
const GlobalErrorHandler = require("./middlewares/GlobalErrorHandler")

const app = express();

app.use(helmet())

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

const limiter = rateLimit({
	windowMs: 30 * 60 * 1000,
	limit: 100,
  message: "Too many requests from this IP, please try again in an hour"
})

app.use("/api", limiter)

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(mongoSanitize())

app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/users", userRoutes)

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(GlobalErrorHandler);

module.exports = app;
