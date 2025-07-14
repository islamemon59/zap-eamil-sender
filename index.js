const express = require("express");
const cors = require("cors");
require("dotenv").config();
const nodemailer = require("nodemailer");
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // parse JSON request bodies

// Root route
app.get("/", (req, res) => {
  res.send("API is running...");
});

console.log(process.env.ZAP_SENDER_EMAIL);

const emailTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.ZAP_SENDER_EMAIL,
    pass: process.env.ZAP_SENDER_PASS,
  },
});

app.get("/send/payment-email", async (req, res) => {
  const paymentInfo = {
    transactionId: "12121212121212",
    user: "emonislam13464@gmail.com",
    parcelInfo: "Mango 2 KG",
  };

  const emailObj = {
    form: `"Zap Email Sender" ${process.env.ZAP_SENDER_EMAIL}`,
    to: paymentInfo.user,
    subject: "Zap Parcel Delivery Payment Confirmation",
    html: `
    <p>Thank you for your payment. We have received your delivery Payment</p>
    <br/>
    <br/>
    <h3>Transaction Id: ${paymentInfo.transactionId}</h3>
    <br/>
    <br/>
    <p>If you face any issue, please reply to this email address</p>
    <button>Click here</button>
    <br/>
    <br/>
    <P>Parcel Info: ${paymentInfo.parcelInfo}</P>
    `,
  };

  try {
    const emailInfo = await emailTransporter.sendMail(emailObj);
    console.log("Email Info", emailInfo.messageId);

    res.send("Success");
  } catch (error) {
    console.log(error);
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
