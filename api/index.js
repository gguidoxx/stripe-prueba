const express = require("express");
const Stripe = require("stripe");
const cors = require("cors");

const app = express();

const stripe = new Stripe(
  "sk_test_51LlZdMC1klrENHbhA1ytkB3kavw59WsUaEUVD6leep6zujOLT8LRltopK34wxJp74gaw19OmRilRwpy8QRxytkWv00HBrV0Cif"
);

app.use(express.json());
app.use(cors({ origin: "http://localhost:3000" }));

app.post("/api/checkout", async (req, res) => {
  const { id, amount } = req.body;
  try {
    const payment = await stripe.paymentIntents.create({
      amount,
      payment_method: id,
      currency: "USD",
      description: "iPhone 2000USD",
      confirm: true,
    });

    console.log(payment);
    res.send({ message: "Successfull payment." });
  } catch (error) {
    console.log(error);
    res.send({message: error.raw.message})
  }
});

app.listen(3001, () => console.log("Servidor corriendo en el puerto 3001"));
