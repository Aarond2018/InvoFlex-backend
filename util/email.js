const nodemailer = require("nodemailer");
const formatDate = require("../util/formatDate")

const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  // port: 587,
  // secure: false,
  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_PW,
  },
});

const sendEmail = async (opts) => {
  const mailOptions = {
    from: '"InvoFlex" <aarondamilola1998@gmail.com>',
    to: opts.email,
    subject: opts.subject,
    text: opts.message,
  };

  // await transporter.sendMail(mailOptions, (error, info) => {
  //   if (error) {
  //     console.error("Error sending email: ", error);
  //   } else {
  //     console.log("Email sent: ", info.response);
  //   }
  // });

  await transporter.sendMail(mailOptions);
};

const sendInvoiceMail = async (invoice) => {
  const dueDate = formatDate(invoice.dueDate)
  const formattedAmount = `${invoice.totalAmount.toLocaleString()}.00`

  const mailOptions = {
    from: `"${invoice.createdBy.name}" <aarondamilola1998@gmail.com>`,
    to: invoice.addressedTo.email,
    subject: `Invoice from ${invoice.createdBy.name}`,
    text: `Hi ${invoice.addressedTo.name},\n\nA new invoice has been generated for you by ${invoice.createdBy.name}. Here's a quick summary:\n\nInvoice Details: INV-${invoice._id} - ${invoice.description}\n\nTotal Invoice Amount: \u20A6${formattedAmount}\n\nDue Date: ${dueDate}\n\nYou can view the invoice or download a PDF copy of it from the following link:\n\nhttps://damilola.invoicely.com/invoice/7468cbe575a34bf493c751f19e4e0896\n\nBest regards,\n${invoice.createdBy.name}`,
    attachments: [
      {
        filename: `INV_${invoice._id}.pdf`,
        path: `${__dirname}/../invoices/${invoice._id}.pdf`,
      },
    ],
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendEmail, sendInvoiceMail };
