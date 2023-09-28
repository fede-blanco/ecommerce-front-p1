import Center from "@/components/Center.js"
import Header from "@/components/Header.js"
import Title from "@/components/Title.js"
import { mongooseConect } from "@/lib/mongoose.js"
import { useEffect, useState } from "react"
import { Product } from "@/models/Product.js"
import { styled } from "styled-components"
import WhiteBox from "@/components/WhiteBox.js"
import ProductImages from "@/components/ProductImages.js"
import CartIcon from "@/components/icons/CartIcon.js"
import FlyingButton from "@/components/FlyingButton.js"
import ProductReviews from "@/components/ProductReviews.js"

const ColWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 40px;
  margin: 40px 0;

  @media screen and (min-width: 768px) {
    grid-template-columns: 0.8fr 1.2fr;
  }
`

const PriceRow = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
`

const Price = styled.span`
  font-size: 1.5rem;
  font-weight: 600;
`

export default function ProductPage({ product }) {
  const [isClient, setIsClient] = useState(false)
  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <>
      {isClient && (
        <>
          <Header />
          <Center>
            <ColWrapper>
              <WhiteBox>
                <ProductImages images={product.images} />
              </WhiteBox>
              <div>
                <Title>{product.title}</Title>
                <p>{product.description}</p>
                <PriceRow>
                  <Price>${product.price}</Price>
                  <div>
                    <FlyingButton
                      main="true"
                      _id={product._id}
                      src={product.images?.[0]}
                    >
                      <strong>
                        {" "}
                        <CartIcon />
                        Add to cart
                      </strong>
                    </FlyingButton>
                  </div>
                </PriceRow>
              </div>
            </ColWrapper>
            <ProductReviews product={product} />
          </Center>
        </>
      )}
    </>
  )
}

export async function getServerSideProps(context) {
  await mongooseConect()
  const id = context.query.id
  const product = await Product.findById({ _id: id })
  return {
    props: {
      product: JSON.parse(JSON.stringify(product)),
    },
  }
}
