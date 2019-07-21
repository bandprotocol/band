import React from 'react'
import { Flex, Text } from 'ui/common'
import styled from 'styled-components'
import CorrectIcon from 'images/correct-modal.svg'

const Pagecontainer = styled.div`
  width: 100%;
  margin: 0 auto 30px auto;
`
const Circle = styled.div`
  border-radius: 50%;
  background-color: ${p => (p.active || p.checked ? '#7365ff' : '#d1d1d1')};
  background-image: ${p =>
    p.active || p.checked
      ? 'linear-gradient(315deg, #6567FF, #5D96FF)'
      : 'linear-gradient(135deg, #d8d8d8, #b6b6b6)'};
  width: 27px;
  height: 27px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  :before {
    position: absolute;
    top: 36px;
    left : 50%;
    content: '${p =>
      p.state === 1 ? 'API Spec' : p.state === 2 ? 'Test Call' : 'Commit'}';
    white-space: nowrap;
    font-size: 14px;
    font-weight: 600;
    color: ${p => (p.active ? '#4a4a4a' : '#a9a9a9')};
    transform: translateX(-50%);
    font-family: 'bio sans';
  }


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
      ? `border-top: 6px solid #6c71fb;`
      : `border-top: 6px solid #d1d1d1;`}
  width: 160px;
`

const Index = styled(Text).attrs({
  fontSize: '15.6px',
  fontWeight: 'bold',
  color: 'white',
  fontFamily: 'code',
})``

const SpecTab = () => (
  <React.Fragment>
    <Circle active state={1}>
      <Index>1</Index>
    </Circle>
    <Line />
    <Circle state={2}>
      <Index>2</Index>
    </Circle>
    <Line />
    <Circle state={3}>
      <Index>3</Index>
    </Circle>
  </React.Fragment>
)

const TestTab = () => (
  <React.Fragment>
    <Circle checked state={1} />
    <Line active />
    <Circle active state={2}>
      <Index>2</Index>
    </Circle>
    <Line />
    <Circle state={3}>
      <Index>3</Index>
    </Circle>
  </React.Fragment>
)
const CommitTab = () => (
  <React.Fragment>
    <Circle checked state={1} />
    <Line active />
    <Circle checked state={2} />
    <Line active />
    <Circle active state={3}>
      <Index>3</Index>
    </Circle>
  </React.Fragment>
)

export default ({ pageState }) => (
  <Pagecontainer>
    <Flex
      style={{ height: '70px' }}
      justifyContent="center"
      alignItems="center"
    >
      {pageState === 1 ? (
        <SpecTab />
      ) : pageState === 2 ? (
        <TestTab />
      ) : (
        <CommitTab />
      )}
    </Flex>
  </Pagecontainer>
)
