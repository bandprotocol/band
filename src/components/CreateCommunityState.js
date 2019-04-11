import React from 'react'
import { Flex } from 'ui/common'
import styled from 'styled-components'
import colors from 'ui/colors'
import CorrectIcon from 'images/correct.svg'

const Pagecontainer = styled.div`
  width: 900px;
  margin: auto;
`

const Circle = styled.div`
  border-radius: 50%;
  background-color: ${p =>
    p.active || p.checked ? colors.purple.dark : 'white'};
  ${p => (p.active || p.checked ? '' : `border: 1px solid #d9d3fb;`)}
  width: 20px;
  height: 20px;
  cursor: pointer; 
  position: relative;

  :before {
    position: absolute;
    top: 40px;
    content: '${p =>
      p.state === 0
        ? 'Basic Information'
        : p.state === 1
        ? 'Token Distribution'
        : 'Governance Parameters'}';
    left: ${p => (p.state === 0 ? '-50px' : p.state === 1 ? '-60px' : '-75px')};
    width: 200px;
    font-weight: ${p => (p.active ? '500' : '200')};
    color: ${p => (p.active ? colors.purple.dark : colors.normal)};
  }

  ${p =>
    p.active
      ? `:after {
    position: absolute;
    top: 3px;
    left: 3px;
    width: 10px;
    height: 10px;
    border: 2px solid #ffffff;
    border-radius: 50%;
    content: '';

  }`
      : ''}

  ${p =>
    p.checked
      ? `:after {
    position: absolute;
    top: 27%;
    left: 20%;
    background-image: url(${CorrectIcon});
    width: 60%;
    height: 60%;
    background-repeat: no-repeat;
    background-size: contain;
    content: '';
  }`
      : ''}
  
`

const Line = styled.div`
  ${p =>
    p.active
      ? `border-top: 2px solid ${colors.purple.dark};`
      : `border-top: 1px solid #ded6ff;`}
  width: 280px;
`

const CommunityInfoState = ({ setPageState }) => (
  <React.Fragment>
    <Circle active state={0} />
    <Line />
    <Circle state={1} onClick={() => setPageState(1)} />
    <Line />
    <Circle state={2} onClick={() => setPageState(2)} />
  </React.Fragment>
)

const CommunityDistributionState = ({ setPageState }) => (
  <React.Fragment>
    <Circle checked state={0} onClick={() => setPageState(0)} />
    <Line active />
    <Circle active state={1} />
    <Line />
    <Circle state={2} onClick={() => setPageState(2)} />
  </React.Fragment>
)
const CommunityParametersState = ({ setPageState }) => (
  <React.Fragment>
    <Circle checked state={0} onClick={() => setPageState(0)} />
    <Line active />
    <Circle checked state={1} onClick={() => setPageState(1)} />
    <Line active />
    <Circle active state={2} />
  </React.Fragment>
)

export default ({ pageState, setPageState }) => (
  <Pagecontainer>
    <Flex
      style={{ height: '100px' }}
      justifyContent="center"
      alignItems="center"
    >
      {pageState === 0 ? (
        <CommunityInfoState setPageState={setPageState} />
      ) : pageState === 1 ? (
        <CommunityDistributionState setPageState={setPageState} />
      ) : (
        <CommunityParametersState setPageState={setPageState} />
      )}
    </Flex>
  </Pagecontainer>
)
