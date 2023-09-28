import Button from "@/components/Button.js"
import { CartContext } from "@/components/CartContext.js"
import Center from "@/components/Center.js"
import Header from "@/components/Header.js"
import Input from "@/components/Input.js"
import Spinner from "@/components/Spinner.js"
import Table from "@/components/Table.js"
import { mongooseConect } from "@/lib/mongoose.js"
import axios from "axios"
import { useSession } from "next-auth/react"
import { RevealWrapper } from "next-reveal"
import { useContext, useEffect, useState } from "react"
import { css, styled } from "styled-components"

const ColumnsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 40px;
  margin-top: 40px;

  table tbody tr td:nth-child(3),
  table tbody tr.subtotal td:nth-child(2) {
    text-align: right;
  }

  table tr.subtotal td {
    padding: 15px 0;
  }
  table tbody tr.subtotal td:nth-child(2) {
    font-size: 1.4rem;
  }
  tr.total td {
    font-size: 1.8rem;
    font-weight: bold;
  }

  @media screen and (min-width: 768px) {
    grid-template-columns: 1.2fr 0.8fr;
  }
`

const Box = styled.div`
  background-color: #fff;
  border-radius: 10px;
  padding: 15px;
  @media screen and (min-width: 768px) {
    padding: 30px;
  }
`

const ProductInfoCell = styled.td`
  padding: 10px 0;
`

const ProductImageBox = styled.div`
  width: 70px;
  height: 70px;
  padding: 2px;
  border: solid 1px rgba(0, 0, 0, 0.1);
  border-radius: 10px;

  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;

  img {
    max-width: 60px;
    max-height: 60px;
  }

  @media screen and (min-width: 768px) {
    padding: 10px;
    width: 100px;
    height: 100px;
    img {
      max-width: 80px;
      max-height: 80px;
    }
  }
`

const QuantityLabel = styled.span`
  padding: 0 15px;
  display: block;
  @media screen and (min-width: 768px) {
    display: inline-block;
    padding: 0 10px;
  }
`

const CityHolder = styled.div`
  display: flex;
  gap: 5px;
`

export default function CartPage() {
  const [isClient, setIsClient] = useState(false)
  // Creamos estado para completarlo con los productos traidos por la api desde la base de datos mediante sus IDs
  const [products, setProducts] = useState([])

  // ESTADOS DE LOS DATOS DE LOS INPUTS
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [city, setCity] = useState("")
  const [postalCode, setPostalCode] = useState("")
  const [streetAdress, setStreetAdress] = useState("")
  const [country, setCountry] = useState("")

  const [loaded, setLoaded] = useState(false)
  const [productsLoading, setProductsLoading] = useState(false)

  const [shippingFee, setShippingFee] = useState(null)

  const { cartProducts, addProduct, removeProduct, setCartProducts } =
    useContext(CartContext)
  const { data: session } = useSession()
  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    setProductsLoading(true)
    if (cartProducts.length > 0) {
      setTimeout(() => {
        axios.post("/api/cart", { ids: cartProducts }).then((response) => {
          setProducts(response.data)
          setProductsLoading(false)
        })
      }, 1500)
    } else {
      setTimeout(() => {
        setProducts([])
        setProductsLoading(false)
      }, 1500)
    }
  }, [cartProducts])

  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }
    if (window.location.href.includes("success")) {
      clearCart()
    }

    axios.get("/api/settings?name=shippingFee").then((res) => {
      setShippingFee(res.data.value)
    })
  }, [])

  useEffect(() => {
    if (!session) {
      setTimeout(() => {
        setLoaded(true)
      }, 1500)
      return
    }
    setTimeout(() => {
      axios.get("/api/adress").then((response) => {
        setName(response.data?.name)
        setEmail(response.data?.email)
        setCity(response.data?.city)
        setPostalCode(response.data?.postalCode)
        setStreetAdress(response.data?.streetAdress)
        setCountry(response.data?.country)
        setLoaded(true)
      })
    }, 1500)
  }, [session])

  function clearCart() {
    setCartProducts([])
  }

  function moreOfThisProduct(id) {
    addProduct(id)
  }

  function lessOfThisProduct(id) {
    removeProduct(id)
  }

  async function goToPayment() {
    const response = await axios.post("/api/checkout", {
      name,
      email,
      city,
      postalCode,
      streetAdress,
      country,
      cartProducts,
      totalPrice,
    })

    if (response.data.url) {
      window.location = response.data.url
    }
  }

  let totalPrice = 0
  for (const productId of cartProducts) {
    const price = products.find((p) => p._id === productId)?.price || 0
    totalPrice += price
  }

  if (isClient) {
    if (window.location.href.includes("success")) {
      return (
        <>
          <Header />
          <Center>
            <ColumnsWrapper>
              <Box>
                <h1>Thanks for ordering!</h1>
                <p>We will email you when your order is ready to be sent!</p>
              </Box>
            </ColumnsWrapper>
          </Center>
        </>
      )
    }
  }

  return (
    <>
      {isClient ? (
        <div>
          <Header />
          <Center>
            <ColumnsWrapper>
              {/* ******************    COLUMNA 1   ****************** */}
              <RevealWrapper delay={0}>
                <Box>
                  <h2>Cart</h2>
                  {productsLoading && <Spinner fullwidth="true" />}
                  {!productsLoading && (
                    <>
                      {!cartProducts?.length && <div>Your cart is empty</div>}

                      {cartProducts?.length > 0 && (
                        <Table>
                          <thead>
                            <tr>
                              <th>Product</th>
                              <th>Quantity</th>
                              <th>Price</th>
                            </tr>
                          </thead>

                          <tbody>
                            {products.map((product) => (
                              <tr key={product._id}>
                                <ProductInfoCell>
                                  <ProductImageBox>
                                    <img src={product.images[0]} alt="" />
                                  </ProductImageBox>
                                  {product.title}
                                </ProductInfoCell>
                                <td>
                                  <Button
                                    onClick={() =>
                                      lessOfThisProduct(product._id)
                                    }
                                  >
                                    -
                                  </Button>
                                  <QuantityLabel>
                                    {
                                      cartProducts.filter(
                                        (id) => id === product._id
                                      ).length
                                    }
                                  </QuantityLabel>
                                  <Button
                                    onClick={() =>
                                      moreOfThisProduct(product._id)
                                    }
                                  >
                                    +
                                  </Button>
                                </td>
                                <td>
                                  ${" "}
                                  {cartProducts.filter(
                                    (id) => id === product._id
                                  ).length * product.price}
                                </td>
                              </tr>
                            ))}
                            <tr className="subtotal">
                              <td colSpan={2}>Products Total</td>
                              <td>$ {totalPrice}</td>
                            </tr>
                            <tr className="subtotal">
                              <td colSpan={2}>Shipping</td>
                              <td>$ {shippingFee}</td>
                            </tr>
                            <tr className="subtotal total">
                              <td colSpan={2}>Total</td>
                              <td>
                                $ {totalPrice + parseInt(shippingFee || 0)}
                              </td>
                            </tr>
                          </tbody>
                        </Table>
                      )}
                    </>
                  )}
                </Box>
              </RevealWrapper>
              {/* ******************    COLUMNA 2   ****************** */}

              {!!cartProducts?.length && (
                <RevealWrapper delay={400}>
                  <Box>
                    <h2>Order information</h2>
                    {!loaded && <Spinner fullwidth="true" />}
                    {loaded && (
                      <>
                        <Input
                          type="text"
                          placeholder="Name"
                          value={name}
                          name="name"
                          onChange={(ev) => setName(ev.target.value)}
                        />
                        <Input
                          type="text"
                          placeholder="Email"
                          value={email}
                          name="email"
                          onChange={(ev) => setEmail(ev.target.value)}
                        />
                        <CityHolder>
                          <Input
                            type="text"
                            placeholder="City"
                            value={city}
                            name="city"
                            onChange={(ev) => setCity(ev.target.value)}
                          />
                          <Input
                            type="text"
                            placeholder="Postal Code"
                            value={postalCode}
                            name="postalCode"
                            onChange={(ev) => setPostalCode(ev.target.value)}
                          />
                        </CityHolder>
                        <Input
                          type="text"
                          placeholder="Street Address"
                          value={streetAdress}
                          name="streetAdress"
                          onChange={(ev) => setStreetAdress(ev.target.value)}
                        />
                        <Input
                          type="text"
                          placeholder="Country"
                          value={country}
                          name="country"
                          onChange={(ev) => setCountry(ev.target.value)}
                        />
                        <input
                          name="products"
                          type="hidden"
                          value={cartProducts.join(",")}
                        />
                        <br />
                        <br />
                        <Button block="true" black="true" onClick={goToPayment}>
                          Continue to payment
                        </Button>
                      </>
                    )}
                  </Box>
                </RevealWrapper>
              )}
            </ColumnsWrapper>
          </Center>
        </div>
      ) : null}
    </>
  )
}
