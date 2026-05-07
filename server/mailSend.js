const { Resend } = require("resend");
const resend = new Resend(process.env.RESEND_API_KEY);
const generateInvoicePDF = require("./generateInvoice");

const sendOtpEmail = async (email, otp) => {
  try {
    await resend.emails.send({
      from: "AJIO Clone <onboarding@resend.dev>",
      to: email,
      subject: "Your AJIO Clone Registration OTP",
      html: `
            <div 
            style="font-family:Arial, sans-serif;
             max-width:500px; 
             margin:auto;
             padding:30px;
             border:1px solid #eee;
             border-radius:10px;     
             "> 
             <h2 style="color:#e63946;">AJIO CLONE</h2>
             <p>Your One Time Password (OTP) for registration is: </p>
             <h1 style="letter-spacing:10px; color:#333">${otp}</h1>
             <p>This OTP is valid for <strong>5 minutes</strong> only.</p>
             <p style="color:#999; font-size:12px;">If you did not request this, please ignore this email.</p>
            
            </div>
            `,
    });
    console.log("OTP email send to:", email);
  } catch (error) {
    console.error("Email send error:", error);
  }
};

const sendOrderConfirmationEmail = async (email, order) => {
  try {
    const itemsHtml = order.items
      .map((item) => `
      <tr>
      <td style="padding:8px; border-bottom:1px solid #eee;">${item.name}</td>
      <td style="padding:8px; border-bottom:1px solid #eee;">${item.brand}</td>
      <td style="padding:8px; border-bottom:1px solid #eee;">${item.qty}</td>
      <td style="padding:8px; border-bottom:1px solid #eee;">Rs.${item.discountPrice || item.price}</td>
      </tr>
      `)
      .join("");

    const gst = Math.round(order.totalAmount * 0.18);
    const subtotal = order.totalAmount - gst;

    const pdfBuffer = await generateInvoicePDF(order);

    await resend.emails.send({
      from: "AJIO Clone <onboarding@resend.dev>",
      to: email,
      subject: `Order Confirmed! #${order._id.toString().slice(-8).toUpperCase()}`,
      html: `
         <div style="font-family:Arial, sans-serif; max-width:600px; margin:auto; padding:30px; border:1px solid #eee; border-radius:10px;">
          <h2 style="color:#e63946;">AJIO Clone</h2>
          <h3>Thank you for your order! 🎉</h3>
          <p>Your order has been placed successfully. Please find your invoice attached.</p>
          <div style="background:#f9f9f9; padding:15px; border-radius:8px; margin:20px 0;">
            <p><strong>Order ID:</strong> #${order._id.toString().slice(-8).toUpperCase()}</p>
            <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
            <p><strong>Delivery Address:</strong> ${order.shippingAddress.addressLine}, ${order.shippingAddress.city} - ${order.shippingAddress.pincode}</p>
          </div>

          <h4>Order Items:</h4>
          <table style="width:100%; border-collapse:collapse;">
          <thead>
           <tr style="background:#e63946; color:white">
            <th style="padding:8px;">Product</th>
            <th style="padding:8px;">Brand</th>
            <th style="padding:8px;">Qty</th>
            <th style="padding:8px;">Price</th>
           </tr>
          </thead>
          <tbody>${itemsHtml}</tbody>
          </table>

          <div style="margin-top:20px; text-align:right;">
           <p>Subtotal: Rs.${subtotal}</p>
           <p>GST (18%): Rs.${gst}</p>
           <h3 style="color:#e63946;">Total: Rs.${order.totalAmount}</h3>
          </div>

          <p style="color:#999; font-size:12px; margin-top:20px;">
          Your invoice PDF is attached to this email.
          </p>
         </div>
        `,
      attachments: [
        {
          filename: `Invoice_${order._id.toString().slice(-8).toUpperCase()}.pdf`,
          content: pdfBuffer,
        },
      ],
    });
    console.log("Order confirmation email with PDF sent to:", email);
  } catch (error) {
    console.error("Order confirmation email error:", error);
  }
};

const sendOrderStatusUpdateEmail = async(email, order) =>{
  try{
    const statusMessages = {
      processing:"Your order is being processed! ",
      shipped:"Your order has been shipped! ",
      delivered:"Your order has been delivered! ",
    };

    const message = statusMessages[order.status] || "Your order status has been updated.";

    await resend.emails.send({
      from:"AJIO Clone <onboarding@resend.dev>",
      to:email,
      subject:`Order Update #${order._id} - ${order.status.toUpperCase()}`,
      html:`
      <div style="font-family:Arial, sans-serif; max-width:600px; margin:auto; padding:30px; border:1px solid #eee ; border-radius:10px">
       <h2 style="color:#e63946">AJIO Clone</h2>
       <h3>${message}</h3>

       <div style="background:#f9f9f9; padding:15px; border-radius:8px; margin:20px 0">
        <p><strong> Order ID:</strong>#${order._id}</p>
        <p><strong>Current Status:</strong>
        <span style="color:#e63946; font-weight:bold; text-transform:uppercase; ">
         ${order.status}
        </span>
        </p>
        <p><strong>Delivery Address:</strong> ${order.shippingAddress.addressLine}, ${order.shippingAddress.city} - ${order.shippingAddress.pincode} </p>
       </div>

       <p>Thank you for shopping with AJIO Clone!</p>
       <p style="color:#999; font-size:12px;">If you have any questions , please contact our support team.</p>
      </div>
      `
    });
    console.log("Order status update email sent to: ", email);

  }catch(error){
    console.error("Order status update email error:" , error);
  }
}

module.exports = {sendOtpEmail, sendOrderConfirmationEmail, sendOrderStatusUpdateEmail};
