import Center from "@/components/Center.js"
import Header from "@/components/Header.js"
import ProductsGrid from "@/components/ProductsGrid.js"
import Spinner from "@/components/Spinner.js"
import { mongooseConect } from "@/lib/mongoose.js"
import { Category } from "@/models/Category.js"
import { Product } from "@/models/Product.js"
import axios from "axios"
import { getServerSession } from "next-auth"
import { useEffect, useState } from "react"
import { styled } from "styled-components"
import { authOptions } from "../api/auth/[...nextauth].js"
import { WishedProduct } from "@/models/WishedProduct.js"

const CategoryHeader = styled.div`
  display: flex;
  flex-direction:column;
  margin-bottom: 15px;
  h1 {
    margin-bottom:10px;
  }
  @media screen and (min-width: 768px) {
    display: flex;
    flex-direction:row;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    margin-bottom: 0px;
    h1 {
      margin-bottom:20px;
    }
  }
`

const FiltersWrapper = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    
  @media screen and (min-width: 768px) {
    display: flex;
    gap: 15px;
  }
`

const Filter = styled.div`
  background-color: #ddd;
  padding: 5px 10px;
  border-radius: 5px;

  display: flex;
  gap: 5px;
  color: #444;

  select {
    background-color: transparent;
    border: 0;
    font-size: inherit;
    color: #444;
  }
`

export default function CategoryPage({
  category,
  subCategories,
  products: originalProducts,
  wishedProducts,
}) {
  const [products, setProducts] = useState(originalProducts)

  const defaultFiltersValues = category.properties.map((p) => ({
    name: p.name,
    value: "all",
  }))
  const [filtersValues, setFiltersValues] = useState(defaultFiltersValues)
  const defaultSorting = "_id-desc"
  const [sort, setSort] = useState(defaultSorting)
  const [loadingProducts, setLoadingProducts] = useState(false)
  const [filtersChanged, setFiltersChanged] = useState(false)
  const [isClient, setIsClient] = useState(false)
  useEffect(() => {
    setIsClient(true)
  }, [])

  function handleFilterChange(filterName, filterValue) {
    setFiltersValues((prev) => {
      const newValue = prev.map((p) => ({
        name: p.name,
        value: p.name === filterName ? filterValue : p.value,
      }))
      return newValue
    })
  }

  useEffect(() => {
    if (!filtersChanged) {
      return;
    }
    setLoadingProducts(true)
    const catsIds = [category._id, ...subCategories.map((cat) => cat._id)]
    const params = new URLSearchParams()
    //seteamos los de categorias
    params.set("categories", catsIds.join(","))
    params.set("sort", sort)
    filtersValues.forEach((f) => {
      if (f.value !== "all") {
        params.set(f.name, f.value)
      }
    })
    const url = `/api/products?` + params.toString()
    axios.get(url).then((res) => {
      setProducts(res.data)
        setTimeout(() => {
          setLoadingProducts(false)
        }, 300);
    })
  }, [filtersValues, sort, filtersChanged])

  return (
    <>
      {isClient && (
        <div>
          <Header />
          <Center>
            <CategoryHeader>
              <h1>{category.name}</h1>
              <FiltersWrapper>
                {category.properties.map((prop) => (
                  <Filter key={prop.name}>
                    <span>{prop.name}:</span>
                    <select
                      onChange={(ev) => {
                        handleFilterChange(prop.name, ev.target.value);
                        setFiltersChanged(true);
                      }}
                      name={prop.name}
                      value={
                        filtersValues.find((f) => f.name === prop.name).value
                      }
                    >
                      <option value="all">All</option>
                      {prop.values.map((val) => (
                        <option key={val} value={val}>
                          {val}
                        </option>
                      ))}
                    </select>
                  </Filter>
                ))}
                <Filter>
                  <span>Sort:</span>
                  <select
                    onChange={(ev) => {
                      setSort(ev.target.value)
                      setFiltersChanged(true)
                    }}
                    value={sort}
                  >
                    <option value="{}_{}">No sort</option>
                    <option value="price-desc">price, highest first</option>
                    <option value="price-asc">price, lowest first</option>
                    <option value="_id-desc">newest first</option>
                    <option value="_id-asc">oldest first</option>
                  </select>
                </Filter>
              </FiltersWrapper>

            </CategoryHeader>
            {loadingProducts && <Spinner fullwidth="true" />}
            {!loadingProducts && (
              <div>
                {products.length > 0 && (
                  <ProductsGrid products={products} wishedProducts={wishedProducts} />
                )}
                {products.length === 0 && (
                  <h3>Sorry, No products found</h3>
                )}
              </div>
          )}
          </Center>
        </div>
      )}
    </>
  )
}

export async function getServerSideProps(context) {
  await mongooseConect()
  const id = context.query.id
  const category = await Category.findById({ _id: id })
  const subCategories = await Category.find({ parent: category._id })
  const catsIds = [category._id, ...subCategories.map((cat) => cat._id)]
  const products = await Product.find({ category: catsIds })

  // *************** LÓGICA DE WISHEDLIST *********************
  const session = await getServerSession(context.req, context.res, authOptions)
  const user = session?.user
  const wishedProducts = user 
  ?
   await WishedProduct.find({
    userEmail: user.email,
    product: products.map(p => p._id),
  })
  : [];
  return {
    props: {
      category: JSON.parse(JSON.stringify(category)),
      subCategories: JSON.parse(JSON.stringify(subCategories)),
      products: JSON.parse(JSON.stringify(products)),
      wishedProducts: JSON.parse(JSON.stringify(wishedProducts.map(i => i.product.toString()))),
    },
  }
}
