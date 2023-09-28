import { mongooseConect } from "@/lib/mongoose.js";
import { Review } from "@/models/Review.js";

export default async function handler(req,res){
  await mongooseConect();
  if(req.method === "GET"){
    const {product} = req.query;
    const allProductReviews = await Review.find({product}, null, {sort:{createdAt:-1}})
    res.json(allProductReviews)
  }
  if(req.method === "POST"){
    const {title, description, stars, product} = req.body;
    const newReview = await Review.create({title,description,stars,product})
    res.json(newReview)
  }
}

