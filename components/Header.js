import Link from "next/link.js"
// Importamos styled-components
import { styled } from "styled-components"
import Center from "./Center.js"
import { useContext, useEffect, useState } from "react"
import { CartContext } from "./CartContext.js"
import BarsIcon from "./icons/Bars.js"
import SearchIcon from "./icons/SearchIcon.js"


const StyledHeader = styled.header`
  z-index: 10;
  background-color: #222;
  position: sticky;
  top: -1px;
`

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 20px 0;
`
const Logo = styled(Link)`

  display: flex;
  align-items: center;
  font-size: 1.5rem;

  color: white;
  text-decoration: none;

  position: relative;
  z-index: 30;
`

const StyledNav = styled.nav`
  display: block;
  gap: 15px;

  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 70px 20px 20px;
  background-color: #222;

  ${(props) =>
    props.mobilenavactive === "true" ? `display: block;` : `display: none;`}

  @media screen and (min-width:768px) {
    display: flex;
    position: static;
    padding: 0;
  }
`

const NavLink = styled(Link)`
  display: flex;
  align-items: center;
  color: #aaa;
  text-decoration: none;
  padding: 10px 0;

  min-width: 30px;
  height: 30px;
  svg {
    height: 30px;
    width: 30px;
  }

  @media screen and (min-width: 768px) {
    padding: 0;
  }
`

const NavButton = styled.button`
  background-color: transparent;
  width: 30px;
  height: 30px;
  border: 0;
  color: #aaa;
  cursor: pointer;

  position: relative;
  z-index: 30;

  svg {
    width: 30px;
    height: 30px;
  }

  @media screen and (min-width: 768px) {
    display: none;
  }
`

const SideIcons = styled.div`
  display:flex;
  align-items:center;
  gap:20px;
`;

// ***********************************************************************
// ***********************************************************************

export default function Header() {
  const { cartProducts } = useContext(CartContext)
  const [isClient, setIsClient] = useState(false)
  const [mobileNavActive, setmobileNavActive] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <>
      {isClient && (
        <StyledHeader>
          <Center>
            <Wrapper>
              <Logo href={"/"}>Ecommerce</Logo>
              <StyledNav mobilenavactive={mobileNavActive.toString()}>
                <NavLink href={"/"}>Home</NavLink>
                <NavLink href={"/products"}>All products</NavLink>
                <NavLink href={"/categories"}>Categories</NavLink>
                <NavLink href={"/account"}>Account</NavLink>
                <NavLink href={"/cart"}>Cart ({cartProducts.length})</NavLink>
              </StyledNav>
              <SideIcons>

              <NavLink href={"/search"}>
                <SearchIcon />
              </NavLink>
              <NavButton onClick={() => setmobileNavActive((prev) => !prev)}>
                <BarsIcon />
              </NavButton>
              </SideIcons>
            </Wrapper>
          </Center>
        </StyledHeader>
      )}
    </>
  )
}
