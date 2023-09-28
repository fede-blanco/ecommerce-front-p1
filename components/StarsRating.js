import { styled } from "styled-components"
import StarOutline from "./icons/StarOutline.js"
import { useState } from "react"
import StarSolid from "./icons/StarSolid.js"
import { primary } from "@/lib/colors.js"

const StarsWrapper = styled.div`
  display: inline-flex;
  gap: 1px;
  height: 1.4rem;
  align-items: center;
`

const StarWrapper = styled.button`
  ${(props) =>
    props?.size === "md" &&
    `
  height: 1.4rem;
  width: 1.4rem;
  `};

  ${(props) =>
    props?.size === "sm" &&
    `
  height: 1rem;
  width: 1rem;
  `};
  ${(props) =>
    props?.size === "lg" &&
    `
  height: 2rem;
  width: 2rem;
  `};

  ${(props) =>
    props?.isDisabled === "false" &&
    `
    cursor: pointer;
  `};

  display: flex;
  padding: 0;
  border: 0;
  display: inline-block;
  background-color: transparent;
  color: ${primary};
`

export default function StarsRating({
  defaultHowMany = 0,
  disabled = "false",
  size = "md",
  onChange = () => {},
}) {
  const [howMany, setHowMany] = useState(defaultHowMany)
  const [isDisabled, setIsDisabled] = useState(disabled)

  const five = [1, 2, 3, 4, 5]

  function handleStarClick(n) {
    if (disabled === "true") {
      return
    }
    setHowMany(n)
    onChange(n)
  }

  return (
    <StarsWrapper>
      {five.map((n) => (
        <>
          <StarWrapper
            isDisabled={isDisabled}
            key={`${n}`}
            size={size}
            onClick={() => handleStarClick(n)}
          >
            {howMany >= n ? <StarSolid /> : <StarOutline />}
          </StarWrapper>
        </>
      ))}
    </StarsWrapper>
  )
}
