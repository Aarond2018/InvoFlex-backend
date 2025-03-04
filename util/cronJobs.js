const cron = require("node-cron");
const Invoice = require("../models/InvoiceModel");

const checkOverdueInvoices = () => {
  //This runs every minute
  // cron.schedule("* * * * *", async () => {

  // Schedule cron job to run every hour
  cron.schedule("0 * * * *", async () => {
    try {
      console.log("Checking for overdue invoices...");

      const now = new Date();
      const result = await Invoice.updateMany(
        { dueDate: { $lt: now }, status: "SENT" },
        { $set: { status: "OVERDUE" } }
      );

      console.log(`Updated ${result.modifiedCount} invoices to OVERDUE.`);
    } catch (error) {
      console.error("Error updating overdue invoices:", error);
    }
  });

  console.log("Cron job for overdue invoices scheduled.");
};

module.exports = checkOverdueInvoices;
