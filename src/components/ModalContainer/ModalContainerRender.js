import React from 'react'
import styled from 'styled-components'
import media from 'ui/media'

const Background = styled.div`
  background-color: rgba(160, 172, 191, 0.45);
  position: fixed;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 1000000000;
  transition: all 400ms;

  ${p =>
    !p.show &&
    `
    opacity: 0;
    pointer-events: none;
  `}
`

const Scroller = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
  overflow: auto;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  overflow: auto;
`

const Container = styled.div`
  position: relative;
  top: 60px;
  margin-bottom: 60px;
  min-width: 300px;

  transition: all 400ms;

  ${p =>
    p.show
      ? `
    opacity: 1;
    transform: translateY(-30px);
  `
      : `
    opacity: 0;
    transform: translateY(0);
  `}

  ${media.mobile} {
    min-width: 100%;
    width: 100%;
  }
`

export default ({ show, modal, hideModal }) => (
  <Background show={show} onClick={hideModal}>
    <Scroller>
      <Container
        show={show}
        onClick={e => e.stopPropagation()}
        hideModal={hideModal}
      >
        {modal}
      </Container>
    </Scroller>
  </Background>
)
