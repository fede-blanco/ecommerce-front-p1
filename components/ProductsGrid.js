import { styled } from "styled-components"
import ProductBox from "./ProductBox.js"
import { RevealWrapper } from "next-reveal"
import Button from "./Button.js"

const StyledProductsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 25px;

  @media screen and (min-width: 768px) {
    grid-template-columns: 1fr 1fr 1fr 1fr;
    gap: 25px;
  }
`

const StyledPaginationButtons = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin: 20px 0px;

  font-size: 1.3rem;
`

export default function ProductsGrid({
  products,
  wishedProducts = [],
  pagination = {},
  setNewPage = () => {},
}) {
  return (
    <div>
      <StyledProductsGrid>
        {products?.length > 0 &&
          products.map((product, index) => (
            <RevealWrapper key={product._id} delay={index * 100}>
              <ProductBox
                product={product}
                wished={wishedProducts.includes(product._id).toString()}
              />
            </RevealWrapper>
          ))}
      </StyledProductsGrid>
      <RevealWrapper delay={1300}>
        <StyledPaginationButtons>
          {pagination.hasPrevPage === true && (
            <Button
              style={{ fontSize: "1rem" }}
              primary="true"
              onClick={() => {
                setNewPage(pagination?.prevPage)
              }}
            >
              {" "}
              {"<<"} Prev
            </Button>
          )}

          {pagination.hasPrevPage === true && pagination.page > 2 && (
            <Button
              style={{ fontSize: "1rem" }}
              primary="true"
              onClick={() => {
                setNewPage(pagination?.page - 2)
              }}
            >
              {pagination.page - 2}
            </Button>
          )}

          {pagination.hasPrevPage === true && (
            <Button
              style={{ fontSize: "1rem" }}
              primary="true"
              onClick={() => {
                setNewPage(pagination?.page - 1)
              }}
            >
              {pagination.page - 1}
            </Button>
          )}

          {pagination.page && <p>Page {pagination.page}</p>}

          {pagination.hasNextPage === true && (
            <Button
              style={{ fontSize: "1rem", margin: "0" }}
              onClick={() => {
                setNewPage(pagination?.page + 1)
              }}
              primary="true"
            >
              {pagination.page + 1}
            </Button>
          )}

          {pagination.hasNextPage === true &&
            pagination?.page + 2 <= pagination.totalPages && (
              <Button
                style={{ fontSize: "1rem" }}
                onClick={() => {
                  setNewPage(pagination?.page + 2)
                }}
                primary="true"
              >
                {pagination.page + 2}
              </Button>
            )}

          {pagination.hasNextPage === true && (
            <Button
              style={{ fontSize: "1rem" }}
              onClick={() => {
                setNewPage(pagination?.nextPage)
              }}
              primary="true"
            >
              {" "}
              Next {">>"}
            </Button>
          )}
        </StyledPaginationButtons>
      </RevealWrapper>
    </div>
  )
}
