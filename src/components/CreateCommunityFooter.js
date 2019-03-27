import React from 'react'
import { Flex, Text, Button } from 'ui/common'
import colors from 'ui/colors'
import styled from 'styled-components'

const Footer = styled.div`
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  background-color: white;
  text-align: center;
  height: 100px;
  box-shadow: 0px -5px 35px 1px rgba(225, 230, 250, 1);
  z-index: 10;
`

const FooterButton = styled(Button).attrs({
  width: '180px',
  variant: 'grey',
})`
  height: 45px;
  box-shadow: 0 3px 5px 0 #baa8ff;

  ${p => (p.disabled ? 'opacity: 0.2;' : 'opacity: 1;')}
`

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
          <Text px={2} color={colors.white} fontSize={2}>
            <i className="fas fa-angle-left" />
          </Text>
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
            <Text px={2} color={colors.white} fontSize={2}>
              <i className="fas fa-angle-right" />
            </Text>
          </Flex>
        </FooterButton>
      )}
    </Flex>
  </Footer>
)
