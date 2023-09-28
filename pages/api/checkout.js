import { mongooseConect } from "@/lib/mongoose.js";
import { Orders } from "@/models/Order.js";
import { Product } from "@/models/Product.js";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth].js";
import { Setting } from "@/models/Setting.js";

const stripe = require('stripe')(process.env.STRIPE_SK);


export default async function handler(req, res){
  if (req.method !== 'POST'){
    res.json("Should be a POST request")
    return;
  }
  await mongooseConect();

  const { name, email, city,postalCode,streetAdress,country, cartProducts, totalPrice } = req.body;
  const productsIds = cartProducts;
  const uniqueIds = [...new Set(productsIds)];
  const productsInfos = await Product.find({_id: uniqueIds});
  let line_items = [];
  for (const productId of uniqueIds){
    const productInfo = productsInfos.find(p => p._id.toString() === productId);
    const quantity = productsIds.filter(id => id === productId)?.length || 0;
    if (quantity > 0 && productInfo)  {
      line_items.push({
        quantity,
        price_data: {
          currency: 'USD',
          product_data: {name:productInfo.title},
          unit_amount: productInfo.price * 100,
        }
      });
    }
  }

  const session = await getServerSession(req,res,authOptions)
  const user = session?.user
  
  const orderDoc = await Orders.create({
    line_items,name,email,city,postalCode,streetAdress,country,paid:false,totalPrice,userEmail:user?.email
  })

  const shippingFeeSetting = await Setting.findOne({name:"shippingFee"});
  const ShippingFeeCents = parseInt(shippingFeeSetting.value || "0") * 100;

  const stripeSession = await stripe.checkout.sessions.create({
    line_items,
    mode: "payment",
    customer_email: email,
    success_url:process.env.NEXT_PUBLIC_URL + "/cart?success=1",
    cancel_url:process.env.NEXT_PUBLIC_URL + "/cart?canceled=1",
    metadata: {orderId:orderDoc._id.toString()},
    allow_promotion_codes:true,
    shipping_options: [
      {
        shipping_rate_data: {
          display_name:"shipping fee",
          type:"fixed_amount",
          fixed_amount:{amount: ShippingFeeCents, currency: "USD"}
        }
      }
    ]
  });
  


  res.json({
    url: stripeSession.url,
  })

}