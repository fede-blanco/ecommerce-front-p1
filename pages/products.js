import Center from "@/components/Center.js"
import Header from "@/components/Header.js"
import ProductsGrid from "@/components/ProductsGrid.js"
import Title from "@/components/Title.js"
import { mongooseConect } from "@/lib/mongoose.js"
import { Product } from "@/models/Product.js"
import { WishedProduct } from "@/models/WishedProduct.js"
import { getServerSession } from "next-auth"
import { useEffect, useState } from "react"
import { styled } from "styled-components"
import { authOptions } from "./api/auth/[...nextauth].js"
import axios from "axios"

export default function Products({
  wishedProducts,
}) {
  const [isClient, setIsClient] = useState(false)

  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState({})
  const [shownProducts, setShownProducts] = useState({})
  const [isLoadedPagination, setisLoadedPagination] = useState(false)
  useEffect(() => {
    setIsClient(true)
  }, [])

  function newPage(page){
    setPage(page)
  }

  function fetchPagination(page = 1) {
    let newPagination = {}
    // ***********************   AGREGADO PARA PAGINATION   *************************
    axios.get("api/products?page="+page).then((response) => {
      setPagination(response.data)
      setShownProducts(response.data.docs)
      newPagination = response.data
    })
    return newPagination
    // ******************************************************************************
  }

  
  useEffect( () => {
    setisLoadedPagination(true)
    fetchPagination(page)
    setisLoadedPagination(false)
    window.scrollTo(0,0)
  }, [page])


  return (
    <>
      {isClient && (
        <div>
          <Header />
          <Center>
            <Title>All Products</Title>
            {!isLoadedPagination && (
              <ProductsGrid
                products={shownProducts}
                wishedProducts={wishedProducts}
                pagination={pagination}
                setNewPage={newPage}
              />
            )}
          </Center>
        </div>
      )}
    </>
  )
}

export async function getServerSideProps(ctx) {
  await mongooseConect()
  const products = await Product.find({}, null, { sort: { _id: -1 } })

  const session = await getServerSession(ctx.req, ctx.res, authOptions)
  const user = session?.user
  const wishedProducts = user
    ? await WishedProduct.find({
        userEmail: user.email,
        product: products.map((p) => p._id.toString()),
      })
    : []

  return {
    props: {
      wishedProducts: JSON.parse(
        JSON.stringify(wishedProducts.map((i) => i.product.toString()))
      ),
    },
  }
}
