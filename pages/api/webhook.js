import { mongooseConect } from "@/lib/mongoose.js";
import { Orders } from "@/models/Order.js";
// importamos stripe y lo ponemos dentro de uina variable
const stripe = require('stripe')(process.env.STRIPE_SK);

import { buffer } from "micro";

// This is where your Stripe CLI webhook secret for testing your endpoint locally goes
const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;
const accountId = process.env.STRIPE_ACCOUNT_ID;


export default async function handler(req, res) {
  // me conecto a mongoose
  await mongooseConect();

  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(await buffer(req), sig, endpointSecret);
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // ******** Handle the event *************
  switch (event.type) {
    case 'checkout.session.completed':
      const data = event.data.object;
      const orderId = data.metadata.orderId;
      const paid = data.payment_status === "paid";
      if (orderId && paid){
        await Orders.findByIdAndUpdate(orderId, {
          paid:true,
        })
      }
      break;
    default:
      // console.log(`Unhandled event type ${event.type}`);
  }

  res.status(200).send("ok")

}

// *********** CONFIG ***********
export const config = {
  api:{bodyParser:false}
}
