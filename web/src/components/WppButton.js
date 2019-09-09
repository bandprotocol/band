import React from 'react'
import styled from 'styled-components'
import { AbsoluteLink, Button, Text, Flex, Image } from 'ui/common'
import { isMobile } from 'ui/media'

import USFlag from 'images/us.svg'
import CNFlag from 'images/cn.svg'
import KRFlag from 'images/kr.svg'

const _isMobile = isMobile()

const OutlineButton = styled(Button)`
  font-family: Avenir;
  color: #122069;
  font-size: 16px;
  font-weight: 600;
  background-color: ${_isMobile ? '#ececec' : 'white'};
  width: ${props => (props.isMobile ? '196px' : '182px')};
  height: 46px;
  border-radius: 2px;
  font-family: bio-sans;
  position: relative;
  padding: ${_isMobile ? '0px 16px' : '8px 16px'};

  #word {
    opacity: 1;
  }

  transition: all 0.6s;

  &:active {
    background-color: #5269ff;
  }

  &:focus {
    outline: none;
  }

  &:hover {
    #word {
      opacity: 0;
    }

    #flags {
      opacity: 1;
      pointer-events: auto;
    }

    background: #ececec;
  }
`

const Flags = styled(Flex).attrs({
  id: 'flags',
  flexDirection: 'row',
  width: '100%',
  justifyContent: 'space-evenly',
})`
  position: absolute;
  left: 0;
  top: 35%;
  opacity: 0;
`

export default () => (
  <OutlineButton isMobile={_isMobile}>
    {_isMobile ? (
      <React.Fragment>
        <Text fontSize="12px" mb="5px">
          Whitepaper v3.0.1
        </Text>
        <Flex width="100%" justifyContent="space-evenly">
          <AbsoluteLink href="/whitepaper-3.0.1.pdf">
            <Image src={USFlag} width="25px" />
          </AbsoluteLink>
          <AbsoluteLink href="/whitepaper-v3.0.1-cn.pdf">
            <Image src={CNFlag} width="25px" />
          </AbsoluteLink>
          <AbsoluteLink href="/whitepaper-v3.0.1-kr.pdf">
            <Image src={KRFlag} width="25px" />
          </AbsoluteLink>
        </Flex>
      </React.Fragment>
    ) : (
      <React.Fragment>
        <Text id="word">Whitepaper v3.0.1</Text>
        <Flags>
          <AbsoluteLink href="/whitepaper-3.0.1.pdf">
            <Image src={USFlag} width="25px" />
          </AbsoluteLink>
          <AbsoluteLink href="/whitepaper-v3.0.1-cn.pdf">
            <Image src={CNFlag} width="25px" />
          </AbsoluteLink>
          <AbsoluteLink href="/whitepaper-v3.0.1-kr.pdf">
            <Image src={KRFlag} width="25px" />
          </AbsoluteLink>
        </Flags>
      </React.Fragment>
    )}
  </OutlineButton>
)
