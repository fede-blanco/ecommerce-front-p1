import { styled } from "styled-components"
import Center from "./Center.js"
import Button from "./Button.js"
import ButtonLink from "./ButtonLink.js"
import CartIcon from "./icons/CartIcon.js"
import FlyingButton from "./FlyingButton.js"
import { RevealWrapper } from "next-reveal"

const Bg = styled.div`
  background-color: #222;
  color: #fff;
  padding: 50px 0;
`

const Title = styled.h1`
  margin: 0;
  font-weight: normal;
  font-size: 1.5rem;
  @media screen and (min-width: 768px) {
    font-size: 2.5rem;
  }
`

const Desc = styled.p`
  color: #aaa;
  font-size: 0.8rem;
`

const ColumnsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 40px;

  div:nth-child(1) {
    order: 2;
  }

  img.featured {
    max-width: 100%;
    max-height: 200px;
    display: block;
    margin: 0 auto;
  }

  @media screen and (min-width: 768px) {
    grid-template-columns: 1.1fr 0.9fr;
    div:nth-child(1) {
      order: 0;
    }
    img.featured {
      max-width: 100%;
      min-width: 100%;
    }
  }
`
const Column = styled.div`
  display: flex;
  align-items: center;
`

const ButtonsWrapper = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 25px;
  justify-content: center;
  @media screen and (min-width: 768px) {
    justify-content: start;
  }
`

const InfoWrapper = styled.div`
  text-align: center;
  @media screen and (min-width: 768px) {
    text-align: left;
  }
`

export default function Featured({ product }) {
  return (
    <Bg>
      <Center>
        <ColumnsWrapper>
          <Column>
            <InfoWrapper>
              <RevealWrapper delay={0} origin="left">
                <Title>{product.title}</Title>
                <Desc>{product.description}</Desc>
                <ButtonsWrapper>
                  <ButtonLink
                    white="true"
                    outline="true"
                    href={"/product/" + product._id}
                  >
                    Read more
                  </ButtonLink>
                  <FlyingButton
                    white="true"
                    src={product.images?.[0]}
                    _id={product._id}
                  >
                    <CartIcon />
                    Add to cart
                  </FlyingButton>
                </ButtonsWrapper>
              </RevealWrapper>
            </InfoWrapper>
          </Column>
          <Column style={{ justifyContent: "center" }}>
            <RevealWrapper delay={0}>
              <img className="featured" src={product.images?.[0]} alt="" />
            </RevealWrapper>
          </Column>
        </ColumnsWrapper>
      </Center>
    </Bg>
  )
}
