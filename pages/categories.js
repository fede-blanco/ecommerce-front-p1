import Center from "@/components/Center.js"
import Header from "@/components/Header.js"
import ProductBox from "@/components/ProductBox.js"
import { Category } from "@/models/Category.js"
import { Product } from "@/models/Product.js"
import Link from "next/link.js"
import { useEffect, useState } from "react"
import { styled } from "styled-components"

// Importamos RevealWrapper para dar afectos de animación a una lista de elementos
import { RevealWrapper } from "next-reveal"
import { getServerSession } from "next-auth"
import { WishedProduct } from "@/models/WishedProduct.js"
import { authOptions } from "./api/auth/[...nextauth].js"
import { mongooseConect } from "@/lib/mongoose.js"

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;

  @media screen and (min-width: 768px) {
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }
`

const CategoryTitle = styled.div`
  display: flex;
  align-items: baseline;
  gap: 15px;
  margin-top: 10px;
  font-size: 1.5rem;

  a {
    color: #555;
    font-size: 1rem;
    text-decoration: none;
  }
  h2 {
    margin-bottom: 10px;
    margin-top: 10px;
  }

  @media screen and (min-width: 768px) {
    font-size: 2rem;
  }
`

const CategoryWrapper = styled.div`
  margin-bottom: 40px;
`

const ShowAllSquare = styled(Link)`
  height:100%;
  background-color: #ddd;
  color: #555;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-decoration: none;
  font-size: 1.2rem;
  font-weight: 500;
`

export default function CategoriesPage({
  mainCategories,
  categories,
  categoriesProducts,
  wishedProducts
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
          <Center>
            {mainCategories.map((cat) => (
              <CategoryWrapper key={cat._id}>
                <CategoryTitle>
                  <h2>{cat.name}</h2>
                  <div>
                    <Link href={"/category/" + cat._id}>Show all &rarr;</Link>
                  </div>
                </CategoryTitle>
                <CategoryGrid>
                  {categoriesProducts[cat._id].map((p, index) => (
                    <RevealWrapper key={p._id} delay={index * 100}>
                      <ProductBox product={p}
                       wished={wishedProducts.includes(p._id).toString()}
                       />
                    </RevealWrapper>
                  ))}
                  <RevealWrapper delay={categoriesProducts[cat._id].length * 100}>
                    <ShowAllSquare href={"/category/" + cat._id}>
                      Show all &rarr;
                    </ShowAllSquare>
                  </RevealWrapper>
                </CategoryGrid>
              </CategoryWrapper>
            ))}
          </Center>
        </div>
      )}
    </>
  )
}

export async function getServerSideProps(ctx) {

  await mongooseConect();

  const categories = await Category.find()
  const mainCategories = categories.filter((c) => !c.parent)
  const categoriesProducts = {}
  
  const allFetchedProductsIds = []

  for (const mainCat of mainCategories) {
    const mainCatId = mainCat._id.toString()
    const childCatIds = categories
      .filter((cat) => cat?.parent?.toString() === mainCatId)
      .map((cat) => cat._id.toString())
    const categoriesIds = [mainCatId, ...childCatIds]
    const products = await Product.find({ category: categoriesIds }, null, {
      limit: 3,
      sort: { _id: -1 },
    })
    categoriesProducts[mainCat._id] = products

    allFetchedProductsIds.push(...products.map(p => p._id.toString()))
  }

  const session = await getServerSession(ctx.req, ctx.res, authOptions)
  const user = session?.user
  const wishedProducts = user 
  ?
   await WishedProduct.find({
    userEmail: user.email,
    product: allFetchedProductsIds,
  })
  : [];

  return {
    props: {
      mainCategories: JSON.parse(JSON.stringify(mainCategories)),
      categories: JSON.parse(JSON.stringify(categories)),
      categoriesProducts: JSON.parse(JSON.stringify(categoriesProducts)),
      wishedProducts: JSON.parse(JSON.stringify(wishedProducts.map(i => i.product.toString()))),
    },
  }
}
