import React from 'react'
import styled from 'styled-components'
import PageContainer from 'components/PageContainer'
import {
  Link,
  Bold,
  Image,
  Flex,
  Box,
  Button,
  AbsoluteLink,
  Text,
  Card,
  Highlight,
} from 'ui/common'
import media, { isMobile } from 'ui/media'

import LogoSrc from 'images/logo.svg'
import { colors } from 'ui'

const Nav = styled.nav`
  display: flex;
  height: 80px;
  align-items: center;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.07);
  position: sticky;
  top: 0;
  background: #ffffff;
  z-index: 1;

  ${media.mobile} {
    height: 60px;
    padding: 0 8px;
  }
`

const ProfileImage = styled(Image).attrs({
  height: 40,
  width: 40,
})`
  cursor: pointer;
  border-radius: 50%;
  border: solid 2px #8868ff;
`

const TextClickable = styled(Text)`
  cursor: pointer;
`

const HighlightBNDOrUSD = ({ isBND, toggle }) => {
  return (
    <Flex mr={3}>
      {isBND ? (
        <Text mr={0} color={colors.purple.normal} fontSize={0}>
          BND
        </Text>
      ) : (
        <TextClickable color={colors.text.grey} onClick={toggle} fontSize={0}>
          BND
        </TextClickable>
      )}
      <Text px={1} color={colors.text.grey}>
        /
      </Text>
      {isBND ? (
        <TextClickable color={colors.text.grey} onClick={toggle} fontSize={0}>
          USD
        </TextClickable>
      ) : (
        <Text mr={0} color={colors.purple.normal} fontSize={0}>
          USD
        </Text>
      )}
    </Flex>
  )
}

export default ({ balance, isBND, toggleBalance, showLogin }) => (
  <Nav>
    <PageContainer fullWidth>
      <Flex alignItems="center">
        <Link dark to="/">
          <Image src={LogoSrc} width={16} ml={4} />
          <Bold ml={[0, 3]}>Band Protocol</Bold>
        </Link>
        <Flex ml="auto">
          <Link dark to="/create-community" px={1}>
            <Flex px={3} alignItems="center">
              <Text color="#8868ff" px={2} fontSize={3}>
                <i className="fas fa-plus-square" />
              </Text>
              <Text color="#8868ff" fontWeight="500" fontSize={0}>
                Create Community
              </Text>
            </Flex>
          </Link>
          {balance !== undefined ? (
            <Flex flexDirection="row" mr={4} alignItems="center">
              <Text mr={2} color="#8868ff" fontSize={0}>
                My Balance:
              </Text>
              <Text mr={2} fontSize={0} color={colors.text.grey}>
                {balance.pretty()}
              </Text>
              <HighlightBNDOrUSD isBND={isBND} toggle={toggleBalance} />
              <ProfileImage src={LogoSrc} />
            </Flex>
          ) : (
            <Button variant="primary" onClick={showLogin} mr={4}>
              Sign in
            </Button>
          )}
        </Flex>
      </Flex>
    </PageContainer>
  </Nav>
)
