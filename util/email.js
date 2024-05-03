const nodemailer = require("nodemailer")

const sendEmail = async (opts) => {
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

  const mailOptions = {
    from: '"InvoFlex" <aarondamilola1998@gmail.com>',
    to: opts.email,
    subject: opts.subject,
    text: opts.message,
    // html: "<b>Hello world?</b>",
  }

  // await transporter.sendMail(mailOptions, (error, info) => {
  //   if (error) {
  //     console.error("Error sending email: ", error);
  //   } else {
  //     console.log("Email sent: ", info.response);
  //   }
  // });

  const info = await transporter.sendMail(mailOptions)
}

module.exports = sendEmail;