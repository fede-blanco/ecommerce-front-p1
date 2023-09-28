import { styled } from "styled-components"
import Button, { ButtonStyle } from "./Button.js"
import CartIcon from "./icons/CartIcon.js"
import Link from "next/link.js"
import { useContext, useEffect, useState } from "react"
import { CartContext } from "./CartContext.js"
import FlyingButton from "./FlyingButton.js"
import HeartOutlineIcon from "./icons/HeartOutlineIcon.js"
import HeartSolidIcon from "./icons/HeartSolidIcon.js"
import axios from "axios"
import { useSession } from "next-auth/react"

const ProductWrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  button {
    width: 100%;
    justify-content: center;
  }
`

const ProductsWhiteBox = styled(Link)`
  background-color: #fff;
  border-radius: 10px;
  padding: 15px;

  min-height: 120px;
  height: auto;
  width: 100%;
  align-items: center;
  display: flex;
  justify-content: center;

  position: relative;

  img.box-img {
    max-width: 90%;
    max-height: 80px;
  }

  div {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`

const Title = styled(Link)`
  font-weight: strong;
  font-size: 0.9rem;
  margin: 0;
  overflow: hidden;
  color: inherit;
  text-decoration: none;
`

const ProductInfoBox = styled.div`
  margin-top: 5px;
`

const PriceRow = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-top: 2px;
  @media screen and (min-width: 768px) {
    display: flex;
    flex-direction: row;
    gap: 5px;
  }
`

const Price = styled(Link)`
  font-size: 1.2rem;
  color: inherit;
  text-decoration: none;
  font-weight: 600;
  text-align: right;
  margin-bottom: 5px;
  @media screen and (min-width: 768px) {
    font-size: 1.3rem;
    text-align: left;
    margin-bottom: 0px;
  }
`

const WishlistButton = styled.button`
  border: 0;
  width: 40px !important;
  height: 40px;
  padding: 10px;
  position: absolute;
  top: 0;
  right: 0;
  background-color: transparent; // Estilo final
  cursor: pointer;

  ${(props) =>
    props.wished === "true"
      ? `
  color:red;
  `
      : `
  color:black;`}

  svg {
    width: 18px;
    height: 18px;
  }
`

export default function ProductBox({
  product,
  wished = "false",
  onRemoveFromWishlist = () => {},
  fetchWishedListPagination = () => {},
  page=1,
  wishedProductsLength=1,
  setWishedListPage=() => {}
}) {
  const { _id, title, description, price, images } = product
  const [isWished, setIsWished] = useState(wished)
  useEffect(() => {
  }, [isWished])
  const url = "/product/" + _id
  const { data: session } = useSession()

  function addToWishlist(ev) {
    ev.preventDefault()
    ev.stopPropagation()
    if (isWished === "false") {
      setIsWished("true")
    } else {
      setIsWished("false")
    }
    if (session) {
      axios
        .post("/api/wishlist", {
          product: _id,
        })
        .then((response) => {
          if(response.data === "Deleted") {
            if((((wishedProductsLength-1) % 4) !== 0)) {
              fetchWishedListPagination(page)
            } else {
              const prevPage = page-1
              setWishedListPage(prevPage)
            }
          }
        })
    }
    return
  }

  return (
    <ProductWrapper>
      <div>
        <ProductsWhiteBox href={url}>
          <div>
            <WishlistButton wished={isWished} onClick={addToWishlist}>
              {isWished === "false" ? <HeartOutlineIcon /> : <HeartSolidIcon />}
            </WishlistButton>
            <img className="box-img" src={images?.[0]} alt="" />
          </div>
        </ProductsWhiteBox>
        <Title href={url}>{title}</Title>
      </div>

      <ProductInfoBox>
        <PriceRow>
          <Price href={url}>${price}</Price>
          <FlyingButton main="true" _id={_id} src={images?.[0]}>
            <strong>Add to cart</strong>
          </FlyingButton>
        </PriceRow>
      </ProductInfoBox>
    </ProductWrapper>
  )
}
