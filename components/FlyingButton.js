import { css, styled } from "styled-components"
import { ButtonStyle } from "./Button.js"
// import FlyingButtonOriginal from "react-flying-item"
import { useContext, useEffect, useRef, useState } from "react"
import { CartContext } from "./CartContext.js"
import { primary } from "@/lib/colors.js"

const FlyingButtonWrapper = styled.div`
  button {
    ${ButtonStyle}
    ${(props) =>
      props.main &&
      `
            background-color: transparent;
      color: ${primary};
      border: 1px solid ${primary};
      svg {
        fill:${primary};
      }
    `}
    ${(props) =>
      props.whiteOutline &&
      `
    background-color: transparent;
      color: #fff;
      border: 1px solid #fff;
      }
    `}
    ${(props) =>
      props.white &&
      `
    background-color: #fff;
      color: #000;
      border: 1px solid #fff;
      }
    `}
  }

  @keyframes fly{
    100%{
      top: 0;
      left: 100%;
      opacity: 0;
    max-width: 50px;
    max-height: 50px;
    }
  }

  img.flying-image {
    max-width: 100px;
    max-height: 100px;
    display: none;
    position: fixed;
    z-index:5;
    animation: fly 1s;
    border-radius: 10px;
  }
`

export default function FlyingButton(props) {
  // Traemos addProduct del contexto
  const { addProduct } = useContext(CartContext)

  const imgRef = useRef()

  function sendImageToCart(ev) {
    imgRef.current.style.display = "inline-block"
    imgRef.current.style.left = (ev.clientX-50) + "px"
    imgRef.current.style.top = (ev.clientY-50) + "px"
    setTimeout(() => {
      imgRef.current.style.display = "none"
    }, 800)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      const reveal = imgRef?.current?.closest("div[data-sr-id]");
      if(reveal?.style.opacity === "1"){
        reveal.style.transform = "none"
      } else {
      }
    }, 100)

    return () => clearInterval(interval)
  }, [])

  return (
    <>
      <FlyingButtonWrapper
        main={props.main}
        whiteOutline={props.whiteOutline}
        white={props.white}
        onClick={() => addProduct(props._id)}
      >
        <img className="flying-image" ref={imgRef} src={props.src} alt="" />
        <button
          onClick={(ev) => sendImageToCart(ev)}
          {...props}
        />
      </FlyingButtonWrapper>
    </>
  )
}
