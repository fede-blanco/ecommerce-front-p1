import { styled } from "styled-components"

const StyledTabs = styled.div`
  display: flex;
  gap: 20px;
`

const StyledTab = styled.span`
  padding: 5px 20px;
  font-size: 1.5rem;
  margin-bottom: 20px;
  cursor: pointer;

  ${(props) =>
    props.active === "true"
      ? `
    color:black;
    border-bottom: solid 2px black;
  `
      : `
    color:#999;`}
`
export default function Tabs({ tabs, active, onChange }) {
  return (
    <StyledTabs>
      {tabs.map((tabName) => (
        <StyledTab
        key={tabName}
        onClick={() => {onChange(tabName)}}
          active={(tabName === active).toString()}
        >
          {tabName}
        </StyledTab>
      ))}
    </StyledTabs>
  )
}
