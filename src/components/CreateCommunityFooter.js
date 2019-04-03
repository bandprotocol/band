import React from 'react'
import { Flex, Text, Button, Image } from 'ui/common'
import colors from 'ui/colors'
import styled from 'styled-components'
import BaseButton from 'components/BaseButton'
import BackIconSrc from 'images/back.svg'
import ForwardIconSrc from 'images/forward.svg'

const Footer = styled.div`
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  background-color: white;
  text-align: center;
  height: 100px;
  box-shadow: 0 -2px 5px 0 rgba(201, 207, 222, 0.12);
  z-index: 10;
`

const FooterButtonRender = styled(Button).attrs({
  width: '180px',
  variant: 'grey',
})`
  height: 45px;
  box-shadow: 0 3px 5px 0 #baa8ff;

  ${p => (p.disabled ? 'opacity: 0.2;' : 'opacity: 1;')}
`

class FooterButton extends BaseButton {
  static Component = FooterButtonRender
}

export default ({ pageState, setPageState, handleSubmit }) => (
  <Footer>
    <Flex
      flexDirection="row"
      alignItems="center"
      justifyContent="space-around"
      pt="28px"
    >
      <FooterButton
        disabled={pageState === 0}
        onClick={() => setPageState(pageState - 1)}
      >
        <Flex flexDirection="row" alignItems="center" justifyContent="center">
          <Image src={BackIconSrc} mx={3} />
          <Text color={colors.white} fontSize={0}>
            Previous
          </Text>
        </Flex>
      </FooterButton>
      {pageState === 2 ? (
        <FooterButton onClick={handleSubmit}>
          <Flex flexDirection="row" alignItems="center" justifyContent="center">
            <Text color={colors.white} fontSize={0}>
              Submit
            </Text>
          </Flex>
        </FooterButton>
      ) : (
        <FooterButton onClick={() => setPageState(pageState + 1)}>
          <Flex flexDirection="row" alignItems="center" justifyContent="center">
            <Text color={colors.white} fontSize={0}>
              Next
            </Text>
            <Image src={ForwardIconSrc} mx={3} />
          </Flex>
        </FooterButton>
      )}
    </Flex>
  </Footer>
)
