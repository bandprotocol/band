import React from 'react'
import styled from 'styled-components'
import PageContainer from 'components/PageContainer'
import {
  Link,
  Bold,
  Image,
  Flex,
  Box,
  SemiBold,
  AbsoluteLink,
  Text,
  Card,
} from 'ui/common'
import media, { isMobile } from 'ui/media'

import LogoSrc from 'images/logo.svg'
import MenuBurgerSrc from 'images/menu-burger.svg'
import MenuCloseSrc from 'images/menu-close.svg'
import { colors } from 'ui'

const Nav = styled.nav`
  display: flex;
  height: 80px;
  align-items: center;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.07);
  position: sticky;
  top: 0;
  background: #ffffff;

  ${media.mobile} {
    height: 60px;
    padding: 0 8px;
  }
`

const Icon = ({ href, pic }) => (
  <Box ml="25px">
    <AbsoluteLink dark href={href}>
      <Text fontSize={26}>
        <i className={pic} />
      </Text>
    </AbsoluteLink>
  </Box>
)

export default class Navbar extends React.Component {
  state = { showMenu: false }

  renderMobile() {
    console.log('showMenu', this.state.showMenu, isMobile())
    return (
      <React.Fragment>
        <Image
          src={MenuBurgerSrc}
          width="24px"
          style={{ marginLeft: 'auto' }}
          onClick={() => this.setState({ showMenu: true })}
        />
        <Card
          style={{
            position: 'fixed',
            top: 0,
            right: 0,
            height: '100vh',
            width: 'calc(100vw - 60px)',
            transition: 'all 400ms',
            background: colors.purple.normal,
            transform: this.state.showMenu ? '' : 'translateX(100%)',
            boxShadow: this.state.showMenu
              ? '-20px 0 50px 0 rgba(0, 0, 0, 0.25)'
              : 'none',
          }}
        >
          <Flex flexDirection="column">
            <Flex flex="0 0 60px" pr="26px" mb={4} alignItems="center">
              <Image
                src={MenuCloseSrc}
                width="24px"
                style={{ marginLeft: 'auto' }}
                onClick={() => this.setState({ showMenu: false })}
              />
            </Flex>
            {/* <Flex flex="0 0 60px" pr="26px" alignItems="center" pl={5}>
              <AbsoluteLink
                href="https://app.bandprotocol.com"
                onClick={() => this.setState({ showMenu: false })}
              >
                <SemiBold color="#fff" fontSize="18px">
                  Application
                </SemiBold>
              </AbsoluteLink>
            </Flex>
            <Flex flex="0 0 60px" pr="26px" alignItems="center" pl={5}>
              <Link
                to="/developer"
                onClick={() => this.setState({ showMenu: false })}
              >
                <SemiBold color="#fff" fontSize="18px">
                  Developer
                </SemiBold>
              </Link>
            </Flex>
            <Flex flex="0 0 60px" pr="26px" alignItems="center" pl={5}>
              <Link
                to="/aboutus"
                onClick={() => this.setState({ showMenu: false })}
              >
                <SemiBold color="#fff" fontSize="18px">
                  About
                </SemiBold>
              </Link>
            </Flex>
            <Flex flex="0 0 60px" pr="26px" alignItems="center" pl={5}>
              <AbsoluteLink
                to="mailto:connect@bandprotocol.com"
                onClick={() => this.setState({ showMenu: false })}
              >
                <SemiBold color="#fff" fontSize="18px">
                  Contact Us
                </SemiBold>
              </AbsoluteLink>
            </Flex> */}
          </Flex>
        </Card>
      </React.Fragment>
    )
  }

  renderDesktop() {
    return (
      <React.Fragment>
        {/* <Flex>
          <Box ml={4}>
            <Link to="/">
              <SemiBold fontSize="14px">Application</SemiBold>
            </Link>
          </Box>
          <Box ml={4}>
            <Link to="/developer">
              <SemiBold fontSize="14px">Developer</SemiBold>
            </Link>
          </Box>
          <Box ml={4}>
            <Link to="/aboutus">
              <SemiBold fontSize="14px">About</SemiBold>
            </Link>
          </Box>
          <Box ml={4}>
            <AbsoluteLink to="mailto:connect@bandprotocol.com">
              <SemiBold fontSize="14px">Contact Us</SemiBold>
            </AbsoluteLink>
          </Box>
        </Flex>
        <Flex ml="auto">
          <Icon
            href="https://t.me/joinchat/E48nA06UIBFmNsE9OaDusQ"
            pic="fab fa-telegram-plane"
          />
          <Icon href="https://medium.com/bandprotocol" pic="fab fa-medium-m" />
          <Icon href="https://twitter.com/bandprotocol" pic="fab fa-twitter" />
        </Flex> */}
      </React.Fragment>
    )
  }

  render() {
    return (
      <Nav>
        <PageContainer>
          <Flex alignItems="center">
            <Link dark to="/">
              <Image src={LogoSrc} width={16} mr={3} />
              <Bold mr={[0, 3]}>Band Protocol</Bold>
            </Link>

            {isMobile() ? this.renderMobile() : this.renderDesktop()}
          </Flex>
        </PageContainer>
      </Nav>
    )
  }
}
