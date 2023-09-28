import Center from "@/components/Center.js"
import Header from "@/components/Header.js"
import Input from "@/components/Input.js"
import ProductsGrid from "@/components/ProductsGrid.js"
import Spinner from "@/components/Spinner.js"
import axios from "axios"
import { debounce } from "lodash"
import { RevealWrapper } from "next-reveal"
import { useCallback, useEffect, useRef, useState } from "react"
import { styled } from "styled-components"

const SearchInput = styled(Input)`
  padding: 10px 10px;
  font-size: 1.3rem;
`

export default function SearchPage() {
  const [isClient, setIsClient] = useState(false)
  const [phrase, setPhrase] = useState("")
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const debouncedSearch = useCallback(debounce(searchProducts, 500), [])

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (phrase.length > 0) {
      setIsLoading(true)
      debouncedSearch(phrase)
    } else {
      setProducts([])
    }
  }, [phrase])

  function searchProducts(phrase) {
    axios
      .get("/api/products?phrase=" + encodeURIComponent(phrase))
      .then((response) => {
        setProducts(response.data)
        setIsLoading(false)
      })
  }

  return (
    <>
      {isClient && (
        <div>
          <Header />
          <Center>
            <div
              style={{ padding: "20px 20px", position: "sticky", top: "75px", backgroundColor:"#eeeeeeaa", zIndex:"9"}}
            >
              <RevealWrapper delay={0}>
                <SearchInput
                  value={phrase}
                  onChange={(ev) => setPhrase(ev.target.value)}
                  autoFocus
                  placeholder="Search for products..."
                />
              </RevealWrapper>
            </div>
            <div>
              {isLoading && <Spinner fullwidth="true" />}
              {!isLoading && phrase !== "" && products.length === 0 && (
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <h2>Sorry, no products found for &quot;{phrase}&quot;</h2>
                </div>
              )}
              {!isLoading && phrase === "" && products.length === 0 && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    textAlign: "center",
                  }}
                >
                  <h2>Enter a query to search for the product you desire!</h2>
                </div>
              )}
              {!isLoading && <ProductsGrid products={products} />}
            </div>
          </Center>
        </div>
      )}
    </>
  )
}
