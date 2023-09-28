import { mongooseConect } from "@/lib/mongoose.js";
import { Product } from "@/models/Product.js";

export default async function handle(req,res) {
  await mongooseConect();
  const ids = req.body.ids;
  res.json(await Product.find({_id: ids}));
}