import { mongooseConect } from "@/lib/mongoose.js"
import { authOptions } from "./auth/[...nextauth].js"
import { WishedProduct } from "@/models/WishedProduct.js"
import { getServerSession } from "next-auth"
import { Product } from "@/models/Product.js"

export default async function handler(req, res) {
  await mongooseConect()
  const { user } = await getServerSession(req, res, authOptions)

  if (req.method === "POST") {
    const { product } = req.body
    const wishedDoc = await WishedProduct.findOne({userEmail: user.email, product: product})
    
    if(wishedDoc) {
      await WishedProduct.findByIdAndDelete(wishedDoc._id);
      res.json("Deleted")
    } else {
      const newWishedDoc = await WishedProduct.create({userEmail: user.email, product: product})
      res.json("Created")
    }
  }

  if(req.method === "GET"){

    const page = req.query.page
  
    if(req.query.page) {
      const response = await WishedProduct.paginate(
        { userEmail: user?.email},
        {
          limit: 4,
          page,
          lean: true,
        }
        )
        const productsWished = response.docs
        let fullProductsIds = []
        productsWished.forEach(async (prod) => {
          fullProductsIds.push(prod.product)
        })
        const fullProducts = await Product.find({_id: fullProductsIds})
      response.docs = fullProducts

      res.json(response)
    } else {
      const wishedProducts = await WishedProduct.find({userEmail:user.email}).populate("product")
      // console.log(wishedProducts);
      res.json(wishedProducts)
    }
  }
}
