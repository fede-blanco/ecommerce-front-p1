import Center from "@/components/Center.js"
import Header from "@/components/Header.js"
import { useEffect, useState } from "react"
import { useSession, signIn, signOut } from "next-auth/react"
import Button from "@/components/Button.js"
import { styled } from "styled-components"
import WhiteBox from "@/components/WhiteBox.js"
import { RevealWrapper } from "next-reveal"
import Input from "@/components/Input.js"
import axios from "axios"
import Spinner from "@/components/Spinner.js"
import ProductBox from "@/components/ProductBox.js"
import Tabs from "@/components/Tabs.js"
import SingleOrder from "@/components/SingleOrder.js"

// **********************   STYLED COMPONENTS   **********************
const ColsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 40px;
  margin-top: 40px;
  margin-bottom: 40px;
  > :nth-child(1) {
    order: 1;
  }

  @media screen and (min-width: 768px) {
    grid-template-columns: 1.2fr 0.8fr;
    :nth-child(1) {
      order: 0;
    }
  }
`
const CityHolder = styled.div`
  display: flex;
  gap: 5px;
`

const WishedProductsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 40px;
  @media screen and (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`
const StyledPaginationButtons = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin: 20px 0px;

  font-size: .9rem;

  @media screen and (min-width: 768px) {
    font-size: 1.2rem;
    
  }
  button{
    font-size: .7rem;
    @media screen and (min-width: 768px) {
      font-size: 1rem;
      
    }
  }
  
`
// *******************************************************************

export default function AccountPage() {
  const [isClient, setIsClient] = useState(false)
  useEffect(() => {
    setIsClient(true)
  }, [])
  const { data: session } = useSession()
  // console.log(session)

  // ESTADOS DE LOS DATOS DE LOS INPUTS
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [city, setCity] = useState("")
  const [postalCode, setPostalCode] = useState("")
  const [streetAdress, setStreetAdress] = useState("")
  const [country, setCountry] = useState("")

  //Estado de carga del formulario
  const [adressLoaded, setAdressLoaded] = useState(false)

  //Estado de la WishedList
  const [wishedProducts, setWishedProducts] = useState([])

  //Estado que almacena la tab activa
  const [activeTab, setActiveTab] = useState("Orders")

  // Estado que almacena las Ordenes del usuario y su estado de carga
  const [orders, setOrders] = useState([])
  const [ordersLoaded, setOrdersLoaded] = useState(false)
  //Agregamos estados que almacenen variables para la paginación de órdenes
  const [ordersPage, setOrdersPage] = useState(1)
  const [ordersPagination, setOrdersPagination] = useState({})
  const [ordersShown, setOrdersShown] = useState([])
  const [isLoadedPagination, setisLoadedPagination] = useState(false)

  //Agregamos estados que almacenen variables para la paginación de órdenes
  const [wishedListPage, setWishedListPage] = useState(1)
  const [wishedListTotalPages, setWishedListTotalPages] = useState(0)
  const [wishedListPagination, setWishedListPagination] = useState({})
  const [wishedListShown, setWishedListShown] = useState([])
  const [isLoadedWishedListPagination, setisLoadedWishedListPagination] =
    useState(false)
  const [wishedListChanged, setWishedListChanged] = useState("")

  //************ LOGIN Y LOGOUT ************* */
  async function logout(provider) {
    await signOut(provider)
  }
  async function login(provider) {
    await signIn(provider)
  }
  //***************************************** */

  useEffect(() => {
    if (!session) {
      setTimeout(() => {
        setAdressLoaded(true)
        // setWishlistLoaded(true)
        setOrdersLoaded(true)
        setisLoadedWishedListPagination(true)
        setisLoadedPagination(true)
      }, 1500)
      return
    }
    axios.get("/api/adress").then((response) => {
      setName(response.data?.name)
      setEmail(response.data?.email)
      setCity(response.data?.city)
      setPostalCode(response.data?.postalCode)
      setStreetAdress(response.data?.streetAdress)
      setCountry(response.data?.country)
      setAdressLoaded(true)
    })
  }, [session, wishedProducts])

  // *************** FUNCIÓN QUE BUSCA LA PAGINACIÓN ************
  function fetchPagination(page = 1) {
    let newPagination = {}
    axios.get("api/orders?page=" + page).then((response) => {
      setOrdersPagination(response.data)
      const paginatedPaidOrders = response.data.docs
      setOrdersShown(paginatedPaidOrders)
      newPagination = response.data
    })
    return newPagination
    // ******************************************************************************
  }

  function fetchWishedListPagination(page = 1) {
    let newPagination = {}
    // ***********************   AGREGADO PARA PAGINATION   *************************
    axios.get("api/wishlist?page=" + page).then((response) => {
      setWishedListPagination(response.data)
      setWishedListShown(response.data.docs)
      setWishedListTotalPages(response.data.totalPages)
      newPagination = response.data
    })
    return newPagination
    // ******************************************************************************
  }

  useEffect(() => {
    if(session) {
      setisLoadedPagination(false)
      fetchPagination(ordersPage)
      // console.log("--------------- newPagination: ", fetchPagination(ordersPage))
      setisLoadedPagination(true)
      return
    }
  }, [ordersPage])

  useEffect(() => {
    if(session){
      setisLoadedWishedListPagination(false)
      fetchWishedListPagination(wishedListPage)
      setisLoadedWishedListPagination(true)
      return
    }
  }, [wishedListPage])

  useEffect(() => {
    if(session){
      fetchWishedListPagination(wishedListPage)
      return
    }
  }, [wishedListChanged])

  //********   FUNCIÓN QUE GUARDA LOS DATOS EN LA BASE DE DATOS  ********
  async function saveAdress() {
    // preparamos los datos que enviaremos como "data" en la petición "axios"
    const data = { name, email, city, postalCode, streetAdress, country }
    await axios.put("/api/adress", data)
  }
  // *******************************************************************

  return (
    <>
      {isClient && (
        <div>
          <Header />
          <Center>
            <ColsWrapper>
              {/* COLUMNA 1 */}
              <div>
                <RevealWrapper delay={0}>
                  {/* Lista de productos deseados */}
                  <WhiteBox style={{ minHeight: "180px" }}>
                    <Tabs
                      tabs={["Orders", "Wishlist"]}
                      // active llevara el valor que tenga el estado "activeTabs" que alberga la tab sleeccionada actualmente
                      active={activeTab}
                      //La prop onChange será en realidad "setActiveTab" que se podrá utilizar dentro del componente <Tabs/>
                      onChange={setActiveTab}
                    />
                    {activeTab === "Wishlist" && (
                      <>
                        {!isLoadedWishedListPagination ? (
                          <Spinner fullwidth={true} />
                        ) : (
                          <>
                            {wishedListShown.length === 0 && !session && (
                              <>
                                {!session ? (
                                  <p>Login to add products to your wishlist!</p>
                                ) : (
                                  <p>Your wishlist is empty!</p>
                                )}
                              </>
                            )}

                            {wishedListShown.length > 0 && (
                              <>
                                <WishedProductsGrid>
                                  {wishedListShown.length > 0 &&
                                    wishedListShown.map((wp) => (
                                      <ProductBox
                                        key={wp._id}
                                        product={wp}
                                        wished="true"
                                        fetchWishedListPagination={
                                          fetchWishedListPagination
                                        }
                                        page={wishedListPage}
                                        wishedProductsLength={
                                          wishedListPagination.totalDocs
                                        }
                                        setWishedListPage={setWishedListPage}
                                      />
                                    ))}
                                </WishedProductsGrid>

                                <RevealWrapper delay={0}>
                                  <StyledPaginationButtons>
                                    {wishedListPagination.hasPrevPage ===
                                      true && (
                                      <Button
                                        primary="true"
                                        onClick={() => {
                                          setWishedListPage(
                                            wishedListPagination?.prevPage
                                          )
                                        }}
                                      >
                                        {" "}
                                        {"<<"} Prev
                                      </Button>
                                    )}

                                    {wishedListPagination.hasPrevPage ===
                                      true &&
                                      wishedListPagination.page > 2 && (
                                        <Button
                                          primary="true"
                                          onClick={() => {
                                            setWishedListPage(
                                              wishedListPagination?.page - 2
                                            )
                                          }}
                                        >
                                          {wishedListPagination.page - 2}
                                        </Button>
                                      )}

                                    {wishedListPagination.hasPrevPage ===
                                      true && (
                                      <Button
                                        primary="true"
                                        onClick={() => {
                                          setWishedListPage(
                                            wishedListPagination?.page - 1
                                          )
                                        }}
                                      >
                                        {wishedListPagination.page - 1}
                                      </Button>
                                    )}

                                    {wishedListPagination.page && (
                                      <p>Page {wishedListPagination.page}</p>
                                    )}

                                    {wishedListPagination.hasNextPage ===
                                      true && (
                                      <Button
                                        style={{
                                          margin: "0",
                                        }}
                                        onClick={() => {
                                          setWishedListPage(
                                            wishedListPagination?.page + 1
                                          )
                                        }}
                                        primary="true"
                                      >
                                        {wishedListPagination.page + 1}
                                      </Button>
                                    )}

                                    {wishedListPagination.hasNextPage ===
                                      true &&
                                      wishedListPagination?.page + 2 <=
                                        wishedListPagination.totalPages && (
                                        <Button
                                          onClick={() => {
                                            setWishedListPage(
                                              wishedListPagination?.page + 2
                                            )
                                          }}
                                          primary="true"
                                        >
                                          {wishedListPagination.page + 2}
                                        </Button>
                                      )}

                                    {wishedListPagination.hasNextPage ===
                                      true && (
                                      <Button
                                        onClick={() => {
                                          setWishedListPage(
                                            wishedListPagination?.nextPage
                                          )
                                        }}
                                        primary="true"
                                      >
                                        {" "}
                                        Next {">>"}
                                      </Button>
                                    )}
                                  </StyledPaginationButtons>
                                </RevealWrapper>
                              </>
                            )}
                          </>
                        )}
                      </>
                    )}

                    {activeTab === "Orders" && (
                      <>
                        {!isLoadedPagination && <Spinner fullwidth="true" />}
                        {isLoadedPagination && (
                          <>
                            {ordersShown.length === 0 && !session && (
                              <>
                                {!session ? (
                                  <p>Login to see your orders!</p>
                                ) : (
                                  <p>You don&apos;t have orders yet!</p>
                                )}
                              </>
                            )}
                            {ordersShown.length > 0 && session && (
                              <>
                                {ordersShown.map((order) => (
                                  <div key={order._id}>
                                    <SingleOrder order={order} />
                                  </div>
                                ))}
                              </>
                            )}
                          </>
                        )}
                        <RevealWrapper delay={0}>
                          <StyledPaginationButtons>
                            {ordersPagination.hasPrevPage === true && (
                              <Button
                                primary="true"
                                onClick={() => {
                                  setOrdersPage(ordersPagination?.prevPage)
                                }}
                              >
                                {" "}
                                {"<<"} Prev
                              </Button>
                            )}

                            {ordersPagination.hasPrevPage === true &&
                              ordersPagination.page > 2 && (
                                <Button
                                  primary="true"
                                  onClick={() => {
                                    setOrdersPage(ordersPagination?.page - 2)
                                  }}
                                >
                                  {ordersPagination.page - 2}
                                </Button>
                              )}

                            {ordersPagination.hasPrevPage === true && (
                              <Button
                                primary="true"
                                onClick={() => {
                                  setOrdersPage(ordersPagination?.page - 1)
                                }}
                              >
                                {ordersPagination.page - 1}
                              </Button>
                            )}

                            {ordersPagination.page && (
                              <p>Page {ordersPagination.page}</p>
                            )}

                            {ordersPagination.hasNextPage === true && (
                              <Button
                                style={{margin: "0" }}
                                onClick={() => {
                                  setOrdersPage(ordersPagination?.page + 1)
                                }}
                                primary="true"
                              >
                                {ordersPagination.page + 1}
                              </Button>
                            )}

                            {ordersPagination.hasNextPage === true &&
                              ordersPagination?.page + 2 <=
                                ordersPagination.totalPages && (
                                <Button
                                  onClick={() => {
                                    setOrdersPage(ordersPagination?.page + 2)
                                  }}
                                  primary="true"
                                >
                                  {ordersPagination.page + 2}
                                </Button>
                              )}

                            {ordersPagination.hasNextPage === true && (
                              <Button
                                onClick={() => {
                                  setOrdersPage(ordersPagination?.nextPage)
                                }}
                                primary="true"
                              >
                                {" "}
                                Next {">>"}
                              </Button>
                            )}
                          </StyledPaginationButtons>
                        </RevealWrapper>
                      </>
                    )}
                  </WhiteBox>
                </RevealWrapper>
              </div>
              {/* COLUMNA 2 */}
              <div>
                <RevealWrapper delay={500}>
                  {/* Formulario de informaión del usuario */}
                  <WhiteBox style={{ minHeight: "180px" }}>
                    {session ? <h2>Account details</h2> : <h2>Login</h2>}
                    {!adressLoaded && <Spinner fullwidth="true" />}
                    {adressLoaded && session && (
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
                        <br />
                        <br />
                        <Button block="true" black="true" onClick={saveAdress}>
                          Save
                        </Button>
                        <hr />
                      </>
                    )}

                    {session && (
                      <Button
                        block="true"
                        primary="true"
                        onClick={() => logout("google")}
                      >
                        Logout
                      </Button>
                    )}
                    {!session && (
                      <Button
                        block="true"
                        primary="true"
                        onClick={() => login("google")}
                      >
                        Login with Google
                      </Button>
                    )}
                  </WhiteBox>
                </RevealWrapper>
              </div>
            </ColsWrapper>
          </Center>
        </div>
      )}
    </>
  )
}
