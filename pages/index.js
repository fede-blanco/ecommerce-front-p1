import Featured from "@/components/Featured.js"
import Header from "@/components/Header.js"
import NewProducts from "@/components/NewProducts.js"
import { mongooseConect } from "@/lib/mongoose.js"
import { Product } from "@/models/Product.js"
import { WishedProduct } from "@/models/WishedProduct.js"
import { getServerSession } from "next-auth"
import { useEffect, useState } from "react"
import { authOptions } from "./api/auth/[...nextauth].js"
import { Setting } from "@/models/Setting.js"

export default function HomePage({
  featuredProduct,
  newProducts,
  wishedNewProducts,
}) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])


  return (
    <>
      {isClient && (
        <div>
          <Header />
          <Featured product={featuredProduct} />
          <NewProducts
            products={newProducts}
            wishedProducts={wishedNewProducts}
          />
        </div>
      )}
    </>
  )
}
export async function getServerSideProps(ctx) {
  await mongooseConect()
  const featuredProductIdSettings = await Setting.findOne({
    name: "featuredProductId",
  })
  const featuredProductId = featuredProductIdSettings.value

  const featuredProduct = await Product.findById(featuredProductId)
  const newProducts = await Product.find({}, null, {
    sort: { _id: -1 },
    limit: 12,
  })
  const session = await getServerSession(ctx.req, ctx.res, authOptions)
  const user = session?.user
  const wishedNewProducts = user
    ? await WishedProduct.find({
        userEmail: user.email,
        product: newProducts.map((p) => p._id.toString()),
      })
    : []

  return {
    props: {
      featuredProduct: JSON.parse(JSON.stringify(featuredProduct)),
      newProducts: JSON.parse(JSON.stringify(newProducts)),
      wishedNewProducts: JSON.parse(
        JSON.stringify(wishedNewProducts.map((i) => i.product.toString()))
      ),
    },
  }
}
