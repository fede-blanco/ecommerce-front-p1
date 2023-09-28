import { BeatLoader } from "react-spinners"
import { styled } from "styled-components"

const Wrapper = styled.div`
${props => props.fullwidth ? `
display:flex;
justify-content:center;
align-items:center;
padding: 40px 0;
` : `
// border: 5px solid blue;
`}
`;

export default function Spinner({fullwidth}) {
  return (
    <>
    <Wrapper fullwidth={fullwidth}>
      <BeatLoader speedMultiplier={3} color={'#555'} />
    </Wrapper>
    </>
  )
}
