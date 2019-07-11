import React from 'react'
import styled from 'styled-components'
import { BackdropConsumer } from 'context/backdrop'

const Backdrop = styled.div`
  background-color: rgba(160, 172, 191, 0.45);
  z-index: 3;
  position: absolute;
  top: 0px;
  left: 220px;
  right: 0px;
  bottom: 0px;
  transition: all 400ms;

  ${p =>
    !p.show &&
    `
    opacity: 0;
    pointer-events: none;
  `}
`

const BaseBackdrop = ({ show, hideBackdrop }) => (
  <Backdrop show={show} onClick={() => hideBackdrop()} />
)

export default props => (
  <BackdropConsumer>
    {({ show, hideBackdrop }) => (
      <BaseBackdrop show={show} hideBackdrop={hideBackdrop} />
    )}
  </BackdropConsumer>
)
