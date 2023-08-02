require("dotenv").config();

const app = require("express")();
const port = 3001;

const path = require("path");
const cors = require("cors");
const shortid = require("shortid");
const Razorpay = require("razorpay");
const bodyParser = require("body-parser");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

app.use(bodyParser.json());
app.use(cors());

app.post("/razorpay", async (req, res) => {
  const payment_capture = 1;
  const amount = req.body.amount; //read amount from the request body
  const currency = "INR";

  const options = {
    amount: amount * 100,
    currency: "INR",
    receipt: shortid.generate(),
    payment_capture,
  };

  try {
    const response = await razorpay.orders.create(options);
    console.log(response);
    res.json({
      id: response.id,
      currency: response.currency,
      amount: response.amount,
    });
  } catch (error) {
    console.log(error);
  }
});

// Backend route for handling the Razorpay payment callback
app.post('/razorpay/callback', async (req, res) => {
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

  // Verify the payment using Razorpay's API
  // For example, you can use the `razorpay_payment_id` and `razorpay_order_id`
  // to fetch the payment details from Razorpay's API and verify the signature

  // If the payment is successful, respond with a success message
  res.json({ status: 'success', message: 'Payment successful' });

  // Otherwise, respond with an error message
  // res.status(400).json({ status: 'error', message: 'Payment failed' });
});


app.listen(port, () => {
  console.log(`Backend running at localhost:${port}`);
});
