import { useEffect, useState } from "react"
import { styled } from "styled-components"

const Image = styled.img`
  max-width: 100%;
  max-height: 100%;
`

const BigImg = styled.img`
  max-width: 100%;
  max-height: 200px;
`

const BigImgWrapper = styled.div`
  text-align: center;
`

const ThumbImage = styled.img`
  max-width: 100%;
  max-height: 100%;
  border-radius: 5px;
`

const ImageButtons = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 10px;
`

const ImageButton = styled.div`
  display: flex;
  border: 1px solid #ccc;
  height: 50px;
  margin-bottom: 10px;
  padding: 1px;
  cursor: pointer;
  border-radius: 5px;

  ${props => props.active === "true" ? `
    border-color: #ccc;
  ` : `
    border-color: transparent;
    opacity: 0.7;
  `}
`

export default function ProductImages({ images }) {
  const [activeImage, setActiveImage] = useState(images?.[0])

  return (
    <>
      <BigImgWrapper>
        <BigImg src={activeImage} alt="image" />
      </BigImgWrapper>

      <ImageButtons>
        {images.map((img) => (
          <ImageButton
            key={img}
            onClick={() => setActiveImage(img)}
            active={`${img===activeImage}`}
          >
            <ThumbImage src={img} alt={img.split("/").pop().split(".")[0]} />
          </ImageButton>
        ))}
      </ImageButtons>
    </>
  )
}
