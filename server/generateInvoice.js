const PDFDocument = require("pdfkit");

const generateInvoicePDF = (order) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const buffers = [];

    doc.on("data", (chunk) => buffers.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(buffers)));
    doc.on("error", reject);

    const gst = Math.round(order.totalAmount * 0.18);
    const subtotal = order.totalAmount - gst;

    doc.fontSize(24).font("Helvetica-Bold").text("AJIO CLONE", 50, 50);
    doc.fontSize(10).font("Helvetica").text("Tax Invoice / Bill of Supply", 50, 80);

    doc.moveTo(50, 95).lineTo(550, 95).stroke();

    doc.fontSize(10).font("Helvetica-Bold").text("ORDER DETAILS", 50, 110);
    doc.font("Helvetica")
      .text(`Order ID: #${order._id.toString().slice(-8).toUpperCase()}`, 50, 125)
      .text(`Date: ${new Date(order.createdAt).toLocaleDateString("en-IN")}`, 50, 140)
      .text(`Payment Method: ${order.paymentMethod}`, 50, 155)
      .text(`Status: ${order.status.toUpperCase()}`, 50, 170);

    doc.fontSize(10).font("Helvetica-Bold").text("DELIVERY ADDRESS", 300, 110);
    doc.font("Helvetica")
      .text(`${order.shippingAddress.name}`, 300, 125)
      .text(`${order.shippingAddress.phone}`, 300, 140)
      .text(`${order.shippingAddress.addressLine}`, 300, 155)
      .text(`${order.shippingAddress.city} - ${order.shippingAddress.pincode}`, 300, 170);

    doc.moveTo(50, 190).lineTo(550, 190).stroke();

    doc.fontSize(10).font("Helvetica-Bold")
      .text("PRODUCT", 50, 205)
      .text("BRAND", 230, 205)
      .text("QTY", 350, 205)
      .text("PRICE", 420, 205)
      .text("TOTAL", 490, 205);

    doc.moveTo(50, 220).lineTo(550, 220).stroke();

    let y = 235;
    doc.font("Helvetica");
    order.items.forEach((item) => {
      const itemPrice = item.discountPrice || item.price;
      const itemTotal = itemPrice * item.qty;

      doc.fontSize(9)
        .text(item.name.substring(0, 25), 50, y)
        .text(item.brand, 230, y)
        .text(`${item.qty}`, 350, y)
        .text(`Rs.${itemPrice}`, 420, y)
        .text(`Rs.${itemTotal}`, 490, y);

      y += 20;
    });

    doc.moveTo(50, y + 5).lineTo(550, y + 5).stroke();
    y += 20;

    doc.fontSize(10).font("Helvetica")
      .text("Subtotal:", 390, y)
      .text(`Rs.${subtotal}`, 490, y);
    y += 16;

    doc.text("GST (18%):", 390, y)
      .text(`Rs.${gst}`, 490, y);
    y += 16;

    doc.moveTo(390, y).lineTo(550, y).stroke();
    y += 8;

    doc.fontSize(11).font("Helvetica-Bold")
      .text("TOTAL:", 390, y)
      .text(`Rs.${order.totalAmount}`, 490, y);

    y += 40;

    doc.moveTo(50, y).lineTo(550, y).stroke();
    y += 12;
    doc.fontSize(9).font("Helvetica")
      .text("Thank you for shopping with AJIO Clone!", 50, y, { align: "center", width: 500 })
      .text("For any queries contact our Customer Care.", 50, y + 14, { align: "center", width: 500 });

    doc.end();
  });
};

module.exports = generateInvoicePDF;