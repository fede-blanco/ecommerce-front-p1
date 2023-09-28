import { styled } from "styled-components"

const StyledOrder = styled.div`
  /* background-color: #aaa; */
  margin: 5px 0;
  padding: 5px 0px 10px 0px;
  border-bottom: 2px solid #ddd;

  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 10px;
`

const ProductsTitle = styled.div`
  font-size: 1.3rem;
  font-weight: 500;
  color: #333;
  line-height: 32px;
`

const StyledTime = styled.time`
  border-bottom: 1px solid #ddd;
  font-size: 0.8rem;
  font-weight: 500;
  line-height: 32px;
  strong {
    font-size: 0.9rem;
    color: #333;
  }
`
const UserInfoLine = styled.div`
  font-size: 0.8rem;
  line-height: 0.9rem;
  span {
    color: #333;
    font-weight: 600;
  }
  div {
    padding-left: 10px;
  }
`

const ProductRow = styled.div`
  span {
    color: #aaa;
  }
`

const ProductsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
`

const TotalPrice = styled.div`
  padding-top: 5px;
  border-top: 1px solid #ddd;
  color: #333;
  display: flex;
  justify-content: space-between;
  font-weight: 600;
  font-size: 1.1rem;
`

export default function SingleOrder({ order }) {
  const {
    line_items,
    createdAt,
    streetAdress,
    city,
    country,
    name,
    email,
    postalCode,
    totalPrice,
  } = order

  return (
    <>
      <StyledOrder>
        <div>
          <StyledTime>
            <strong>Ordered :</strong>{" "}
            {new Date(createdAt)
              .toLocaleString("es-AR", {
                timeZone: "America/Argentina/Buenos_Aires",
              })
              .replace(",", " - ")}
          </StyledTime>
          <UserInfoLine>
            <span>Name</span>
            <br /> <div>{name}</div>
          </UserInfoLine>
          <UserInfoLine>
            <span>Email</span>
            <br /> <div>{email}</div>
          </UserInfoLine>
          <UserInfoLine>
            <span>Adress</span>
            <br />{" "}
            <div>
              {streetAdress}
              <br /> {city}, {country}
            </div>
          </UserInfoLine>
          <UserInfoLine>
            <span>Postal code</span>
            <br /> <div>{postalCode}</div>
          </UserInfoLine>
        </div>
        <div style={{ borderLeft: "1px solid #ddd" }}></div>
        <ProductsWrapper>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              paddingBottom: "10px",
            }}
          >
            <ProductsTitle>Products</ProductsTitle>

            {line_items.map((item) => (
              <ProductRow key={item.price_data.product_data.name}>
                <span>{item.quantity} x </span>
                {item.price_data.product_data.name}
              </ProductRow>
            ))}
          </div>
          <TotalPrice>
            Total price: <span>${totalPrice}</span>{" "}
          </TotalPrice>
        </ProductsWrapper>
      </StyledOrder>
    </>
  )
}
