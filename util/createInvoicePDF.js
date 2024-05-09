const fs = require("fs");
const PDFDocument = require("pdfkit");
const formatDateString = require("../util/formatDate")

async function createInvoice(invoice) {
  let doc = new PDFDocument({ size: "A4", margin: 50 });
  generateHeader(doc, invoice);
  generateCustomerInformation(doc, invoice);
  generateInvoiceTable(doc, invoice);
  generateFooter(doc);

  doc.end();
  doc.pipe(fs.createWriteStream(`${__dirname}/../invoices/${invoice._id.toString()}.pdf`));
}

function generateHeader(doc, invoice) {
  doc
    .image(`${__dirname}/../assets/logo.png`, 40, 20, { width: 100 })
    // .fillColor("#333333")
    // .fontSize(20)
    // .text("ACME Inc.", 110, 57)
    .fontSize(10)
    .text(`${invoice.createdBy.businessName}`, 200, 50, { align: "right" })
    .text(`${invoice.createdBy.email}`, 200, 65, { align: "right" })
    .moveDown();
}

function generateCustomerInformation(doc, invoice) {
  doc
    .fillColor("#444444")
    .fontSize(20)
    .text("Invoice", 50, 160);

  generateHr(doc, 185);

  const customerInformationTop = 200;

  doc
    .fontSize(10)
    .text("Invoice Id:", 50, customerInformationTop)
    .font("Helvetica-Bold")
    .text(invoice._id, 120, customerInformationTop)
    .font("Helvetica")
    .text("Invoice Date:", 50, customerInformationTop + 15)
    .text(formatDateString(invoice.createdAt), 120, customerInformationTop + 15)
    .text("Invoice Due:", 50, customerInformationTop + 30)
    .text(
      formatDateString(invoice.dueDate),
      120,
      customerInformationTop + 30
    )

    .font("Helvetica-Bold")
    .text(invoice.addressedTo.name, 300, customerInformationTop)
    .font("Helvetica")
    .text(invoice.addressedTo.email, 300, customerInformationTop + 15)
    .text(
      invoice.addressedTo.address,
      300,
      customerInformationTop + 30
    )
    .moveDown();

  generateHr(doc, 252);
}

function generateInvoiceTable(doc, invoice) {
  let i;
  const invoiceTableTop = 330;

  doc.font("Helvetica-Bold");
  generateTableRow(
    doc,
    invoiceTableTop,
    "Index",
    "Description",
    "Rate",
    "Quantity",
    "Line Total"
  );
  generateHr(doc, invoiceTableTop + 20);
  doc.font("Helvetica");

  for (i = 0; i < invoice.items.length; i++) {
    const item = invoice.items[i];
    const position = invoiceTableTop + (i + 1) * 30;
    generateTableRow(
      doc,
      position,
      i + 1,
      item.description,
      formatCurrency(item.rate),
      item.quantity,
      formatCurrency(item.rate * item.quantity)
    );

    generateHr(doc, position + 20);
  }

  //change subtotal later to deduct tax
  const subtotalPosition = invoiceTableTop + (i + 1) * 30;
  generateTableRow(
    doc,
    subtotalPosition,
    "",
    "",
    "Subtotal",
    "",
    formatCurrency(invoice.totalAmount)
  );

  const taxAppliedPosition = subtotalPosition + 20;
  generateTableRow(
    doc,
    taxAppliedPosition,
    "",
    "",
    "Tax",
    "",
    formatCurrency(0)
  );

  const totalPosition = taxAppliedPosition + 25;
  doc.font("Helvetica-Bold");
  generateTableRow(
    doc,
    totalPosition,
    "",
    "",
    "Total Amount",
    "",
    formatCurrency(invoice.totalAmount)
  );
  doc.font("Helvetica");
}

function generateFooter(doc) {
  doc
    .fontSize(10)
    .text(
      "Powered by InvoFlex.",
      50,
      780,
      { align: "center", width: 500 }
    );
}

function generateTableRow(
  doc,
  y,
  item,
  description,
  unitCost,
  quantity,
  lineTotal
) {
  doc
    .fontSize(10)
    .text(item, 50, y)
    .text(description, 150, y)
    .text(unitCost, 280, y, { width: 90, align: "right" })
    .text(quantity, 370, y, { width: 90, align: "right" })
    .text(lineTotal, 0, y, { align: "right" });
}

function generateHr(doc, y) {
  doc
    .strokeColor("#aaaaaa")
    .lineWidth(1)
    .moveTo(50, y)
    .lineTo(550, y)
    .stroke();
}

function formatCurrency(amount) {
  const formatted = `N${amount.toLocaleString()}.00`
  return formatted;
}

// function formatDate(date) {
//   const day = date.getDate();
//   const month = date.getMonth() + 1;
//   const year = date.getFullYear();

//   return year + "/" + month + "/" + day;
// }

module.exports = createInvoice