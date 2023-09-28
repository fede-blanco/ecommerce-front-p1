import Link from "next/link.js"
import { ButtonStyle } from "./Button.js"
import { styled } from "styled-components"

const StyledLink = styled(Link)`
  ${ButtonStyle}
`
export default function ButtonLink(props) {
  return (
    <StyledLink {...props} />
  )
}
