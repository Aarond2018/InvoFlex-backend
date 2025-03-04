const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet")
const rateLimit = require("express-rate-limit")
const mongoSanitize = require("express-mongo-sanitize")
const cors = require("cors")

const authRoutes = require("./routes/auth-routes")
const userRoutes = require("./routes/user-routes")
const clientRoutes = require("./routes/client-routes")
const invoiceRoutes = require("./routes/invoice-routes")
const reportsRoutes = require("./routes/report-routes")
const dashboardRoute = require("./routes/dashboard-route")
const AppError = require("./util/AppError")
const GlobalErrorHandler = require("./middlewares/GlobalErrorHandler")

// Import and run cron job
const checkOverdueInvoices = require("./util/cronJobs");
checkOverdueInvoices();

const app = express();

app.use(helmet())

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

const limiter = rateLimit({
	windowMs: 30 * 60 * 1000,
	limit: 100,
  message: "Too many requests from this IP, please try again in an hour",
  xForwardedForHeader: false
})

app.use(cors())

app.use("/api", limiter)

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(mongoSanitize())

app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/users", userRoutes)
app.use("/api/v1/clients", clientRoutes)
app.use("/api/v1/invoices", invoiceRoutes)
app.use("/api/v1/reports", reportsRoutes)
app.use("/api/v1/dashboard", dashboardRoute)

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(GlobalErrorHandler);

module.exports = app;
