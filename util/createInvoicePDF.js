// const fs = require("fs");
// const PDFDocument = require("pdfkit");
// const formatDateString = require("../util/formatDate")

// async function createInvoice(invoice) {
//   let doc = new PDFDocument({ size: "A4", margin: 50 });
//   generateHeader(doc, invoice);
//   generateCustomerInformation(doc, invoice);
//   generateInvoiceTable(doc, invoice);
//   generateFooter(doc);

//   doc.end();
//   doc.pipe(fs.createWriteStream(`${__dirname}/../invoices/${invoice._id.toString()}.pdf`));
// }

// function generateHeader(doc, invoice) {
//   doc
//     .image(`${__dirname}/../assets/logo.png`, 40, 20, { width: 100 })
//     // .fillColor("#333333")
//     // .fontSize(20)
//     // .text("ACME Inc.", 110, 57)
//     .fontSize(10)
//     .text(`${invoice.createdBy.businessName}`, 200, 50, { align: "right" })
//     .text(`${invoice.createdBy.email}`, 200, 65, { align: "right" })
//     .moveDown();
// }

// function generateCustomerInformation(doc, invoice) {
//   doc
//     .fillColor("#444444")
//     .fontSize(20)
//     .text("Invoice", 50, 160);

//   generateHr(doc, 185);

//   const customerInformationTop = 200;

//   doc
//     .fontSize(10)
//     .text("Invoice Id:", 50, customerInformationTop)
//     .font("Helvetica-Bold")
//     .text(invoice._id, 120, customerInformationTop)
//     .font("Helvetica")
//     .text("Invoice Date:", 50, customerInformationTop + 15)
//     .text(formatDateString(invoice.createdAt), 120, customerInformationTop + 15)
//     .text("Invoice Due:", 50, customerInformationTop + 30)
//     .text(
//       formatDateString(invoice.dueDate),
//       120,
//       customerInformationTop + 30
//     )

//     .font("Helvetica-Bold")
//     .text(invoice.addressedTo.name, 300, customerInformationTop)
//     .font("Helvetica")
//     .text(invoice.addressedTo.email, 300, customerInformationTop + 15)
//     .text(
//       invoice.addressedTo.address,
//       300,
//       customerInformationTop + 30
//     )
//     .moveDown();

//   generateHr(doc, 252);
// }

// function generateInvoiceTable(doc, invoice) {
//   let i;
//   const invoiceTableTop = 330;

//   doc.font("Helvetica-Bold");
//   generateTableRow(
//     doc,
//     invoiceTableTop,
//     "Index",
//     "Description",
//     "Rate",
//     "Quantity",
//     "Line Total"
//   );
//   generateHr(doc, invoiceTableTop + 20);
//   doc.font("Helvetica");

//   for (i = 0; i < invoice.items.length; i++) {
//     const item = invoice.items[i];
//     const position = invoiceTableTop + (i + 1) * 30;
//     generateTableRow(
//       doc,
//       position,
//       i + 1,
//       item.description,
//       formatCurrency(item.rate),
//       item.quantity,
//       formatCurrency(item.rate * item.quantity)
//     );

//     generateHr(doc, position + 20);
//   }

//   //change subtotal later to deduct tax
//   const subtotalPosition = invoiceTableTop + (i + 1) * 30;
//   generateTableRow(
//     doc,
//     subtotalPosition,
//     "",
//     "",
//     "Subtotal",
//     "",
//     formatCurrency(invoice.totalAmount)
//   );

//   const taxAppliedPosition = subtotalPosition + 20;
//   generateTableRow(
//     doc,
//     taxAppliedPosition,
//     "",
//     "",
//     "Tax",
//     "",
//     `${invoice.taxApplied}%`
//   );

//   const totalPosition = taxAppliedPosition + 25;
//   doc.font("Helvetica-Bold");
//   generateTableRow(
//     doc,
//     totalPosition,
//     "",
//     "",
//     "Total Amount",
//     "",
//     formatCurrency(invoice.totalAmount)
//   );
//   doc.font("Helvetica");
// }

// function generateFooter(doc) {
//   doc
//     .fontSize(10)
//     .text(
//       "Powered by InvoFlex.",
//       50,
//       780,
//       { align: "center", width: 500 }
//     );
// }

// function generateTableRow(
//   doc,
//   y,
//   item,
//   description,
//   unitCost,
//   quantity,
//   lineTotal
// ) {
//   doc
//     .fontSize(10)
//     .text(item, 50, y)
//     .text(description, 150, y)
//     .text(unitCost, 280, y, { width: 90, align: "right" })
//     .text(quantity, 370, y, { width: 90, align: "right" })
//     .text(lineTotal, 0, y, { align: "right" });
// }

// function generateHr(doc, y) {
//   doc
//     .strokeColor("#aaaaaa")
//     .lineWidth(1)
//     .moveTo(50, y)
//     .lineTo(550, y)
//     .stroke();
// }

// function formatCurrency(amount) {
//   const formatted = `N${amount.toLocaleString()}.00`
//   return formatted;
// }

// // function formatDate(date) {
// //   const day = date.getDate();
// //   const month = date.getMonth() + 1;
// //   const year = date.getFullYear();

// //   return year + "/" + month + "/" + day;
// // }

// module.exports = createInvoice





const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");
const formatDateString = require("../util/formatDate");

async function createInvoice(invoice) {
  try {
    // Ensure the invoices directory exists
    const invoicesDir = path.join(__dirname, "../invoices");
    if (!fs.existsSync(invoicesDir)) {
      fs.mkdirSync(invoicesDir, { recursive: true });
    }

    const pdfPath = path.join(invoicesDir, `${invoice._id.toString()}.pdf`);
    let doc = new PDFDocument({ size: "A4", margin: 50 });

    // Create file stream before writing to doc
    const writeStream = fs.createWriteStream(pdfPath);
    doc.pipe(writeStream);

    generateHeader(doc, invoice);
    generateCustomerInformation(doc, invoice);
    generateInvoiceTable(doc, invoice);
    generateFooter(doc);

    doc.end();

    // Ensure the stream is closed properly
    return new Promise((resolve, reject) => {
      writeStream.on("finish", () => {
        console.log("PDF successfully created:", pdfPath);
        resolve(pdfPath);
      });
      writeStream.on("error", (err) => {
        console.error("Error writing PDF file:", err);
        reject(err);
      });
    });
  } catch (error) {
    console.error("Error creating invoice PDF:", error);
    throw error;
  }
}

function generateHeader(doc, invoice) {
  doc
    .image(path.join(__dirname, "../assets/logo.png"), 40, 20, { width: 100 })
    .fontSize(10)
    .text(invoice.createdBy.businessName || "Business Name", 200, 50, { align: "right" })
    .text(invoice.createdBy.email || "example@email.com", 200, 65, { align: "right" })
    .moveDown();
}

function generateCustomerInformation(doc, invoice) {
  doc.fillColor("#444444").fontSize(20).text("Invoice", 50, 160);
  generateHr(doc, 185);

  const customerInformationTop = 200;
  doc
    .fontSize(10)
    .text("Invoice ID:", 50, customerInformationTop)
    .font("Helvetica-Bold")
    .text(invoice._id.toString(), 120, customerInformationTop)
    .font("Helvetica")
    .text("Invoice Date:", 50, customerInformationTop + 15)
    .text(formatDateString(invoice.createdAt), 120, customerInformationTop + 15)
    .text("Invoice Due:", 50, customerInformationTop + 30)
    .text(formatDateString(invoice.dueDate), 120, customerInformationTop + 30)
    .font("Helvetica-Bold")
    .text(invoice.addressedTo.name || "Customer Name", 300, customerInformationTop)
    .font("Helvetica")
    .text(invoice.addressedTo.email || "customer@email.com", 300, customerInformationTop + 15)
    .text(invoice.addressedTo.address || "Customer Address", 300, customerInformationTop + 30)
    .moveDown();

  generateHr(doc, 252);
}

function generateInvoiceTable(doc, invoice) {
  const invoiceTableTop = 330;
  doc.font("Helvetica-Bold");

  generateTableRow(doc, invoiceTableTop, "Index", "Description", "Rate", "Quantity", "Line Total");
  generateHr(doc, invoiceTableTop + 20);
  doc.font("Helvetica");

  let i;
  for (i = 0; i < invoice.items.length; i++) {
    const item = invoice.items[i];
    const position = invoiceTableTop + (i + 1) * 30;

    generateTableRow(
      doc,
      position,
      i + 1,
      item.description || "No description",
      formatCurrency(item.rate),
      item.quantity,
      formatCurrency(item.rate * item.quantity)
    );

    generateHr(doc, position + 20);
  }

  // Subtotal
  const subtotalPosition = invoiceTableTop + (i + 1) * 30;
  generateTableRow(doc, subtotalPosition, "", "", "Subtotal", "", formatCurrency(invoice.totalAmount));

  // Tax Applied
  const taxAppliedPosition = subtotalPosition + 20;
  generateTableRow(doc, taxAppliedPosition, "", "", "Tax", "", `${invoice.taxApplied || 0}%`);

  // Total Amount
  const totalPosition = taxAppliedPosition + 25;
  doc.font("Helvetica-Bold");
  generateTableRow(doc, totalPosition, "", "", "Total Amount", "", formatCurrency(invoice.totalAmount));
  doc.font("Helvetica");
}

function generateFooter(doc) {
  doc
    .fontSize(10)
    .text("Powered by InvoFlex.", 50, 780, { align: "center", width: 500 });
}

function generateTableRow(doc, y, item, description, unitCost, quantity, lineTotal) {
  doc
    .fontSize(10)
    .text(item, 50, y)
    .text(description, 150, y)
    .text(unitCost, 280, y, { width: 90, align: "right" })
    .text(quantity, 370, y, { width: 90, align: "right" })
    .text(lineTotal, 470, y, { width: 90, align: "right" });
}

function generateHr(doc, y) {
  doc.strokeColor("#aaaaaa").lineWidth(1).moveTo(50, y).lineTo(550, y).stroke();
}

function formatCurrency(amount) {
  if (!amount || isNaN(amount)) return "N0.00";
  return `N${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

module.exports = createInvoice;
