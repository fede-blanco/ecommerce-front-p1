import { primary } from "@/lib/colors.js"
import { css, styled } from "styled-components"

 export const ButtonStyle = css`
  border: 0;
  padding: 5px 15px;
  border-radius: 5px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  text-decoration: none;
  font-weight: 500;
  
  font-family: 'Poppins', sans-serif;
  font-size: .9rem;



  svg {
    height: 16px;
    margin-right: 5px;
    fill: #fff;
  }

  ${(props) => 
    props.block &&
    css`
      display: block;
      width: 100%;
    `
  }

  ${(props) =>
    props.white &&
    !props.outline &&
    css`
      background-color: #fff;
      color: #000;
    `}

  ${(props) =>
    props.white &&
    props.outline &&
    css`
      background-color: transparent;
      color: #fff;
      border: 1px solid #fff;
    `}

  ${(props) =>
    props.black &&
    !props.outline &&
    css`
      background-color: #000;
      color: #fff;
      border: 1px solid #000;
    `}

  ${(props) =>
    props.black &&
    props.outline &&
    css`
      background-color: transparent;
      color: #000;
      border: 1px solid #000;
    `}

    ${(props) =>
    props.size === "l" &&
    css`
      font-size: 1.2rem;
      padding: 10px 20px;
      svg {
        height: 20px;
      }
    `}

    ${(props) =>
    props.primary &&
    !props.outline &&
    css`
      background-color: ${primary};
      color: #fff;
      border: 1px solid ${primary};
    `}

    ${(props) =>
    props.primary && props.outline &&
    css`
      background-color: transparent;
      color: ${primary};
      border: 1px solid ${primary};
      svg {
        fill:${primary};
      }
    `}
`
const StyledButton = styled.button`
  ${ButtonStyle}
`

export default function Button({ children, ...rest }) {
  return <StyledButton {...rest}>{children}</StyledButton>
}
