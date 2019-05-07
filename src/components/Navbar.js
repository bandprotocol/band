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
import { withRouter } from 'react-router-dom'

import LogoSrc from 'images/logo.svg'
import MenuBurgerSrc from 'images/menu-burger.svg'
import MenuCloseSrc from 'images/menu-close.svg'
import { colors } from 'ui'

const Nav = styled.nav`
  display: flex;
  height: 80px;
  align-items: center;
  position: sticky;
  top: 0;
  background: ${colors.background.dark};
  z-index: 999;

  ${media.mobile} {
    height: 60px;
    padding: 0 8px;
  }

  a {
    color: #ffffff;

    &:hover {
      color: #bfcdff;
    }
  }
`

class Navbar extends React.Component {
  state = { showMenu: false }

  renderMobile() {
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
            <Flex flex="0 0 60px" pr="26px" alignItems="center" pl={5}>
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
                to="/developers"
                onClick={() => this.setState({ showMenu: false })}
              >
                <SemiBold color="#fff" fontSize="18px">
                  Developers
                </SemiBold>
              </Link>
            </Flex>
            <Flex flex="0 0 60px" pr="26px" alignItems="center" pl={5}>
              <Link
                to="/about"
                onClick={() => this.setState({ showMenu: false })}
              >
                <SemiBold color="#fff" fontSize="18px">
                  About
                </SemiBold>
              </Link>
            </Flex>
            <Flex flex="0 0 60px" pr="26px" alignItems="center" pl={5}>
              <AbsoluteLink
                target="_self"
                to="mailto:connect@bandprotocol.com"
                onClick={() => this.setState({ showMenu: false })}
              >
                <SemiBold color="#fff" fontSize="18px">
                  Contact Us
                </SemiBold>
              </AbsoluteLink>
            </Flex>
          </Flex>
        </Card>
      </React.Fragment>
    )
  }

  renderDesktop() {
    const { pathname } = this.props.location
    return (
      <Flex ml="auto">
        <Box ml="40px">
          <Link to="/why-band">
            <Text fontSize="16px">Why Band?</Text>
          </Link>
        </Box>
        <Box ml="40px">
          <Link to="/products/tcd">
            <Text fontSize="16px">Products</Text>
          </Link>
        </Box>
        <Box ml="40px">
          <Link to="/explorers">
            <Text fontSize="16px">Explorers</Text>
          </Link>
        </Box>
        <Box ml="40px">
          <Link to="/company">
            <Text fontSize="16px">Company</Text>
          </Link>
        </Box>
        <Box ml="40px">
          <AbsoluteLink target="_blank" to="https://medium.com/bandprotocol">
            <Text fontSize="16px">Blog</Text>
          </AbsoluteLink>
        </Box>
      </Flex>
    )
  }

  render() {
    return (
      <Nav>
        <PageContainer>
          <Flex alignItems="center">
            <Link dark to="/">
              <Image src={LogoSrc} height={32} mr={3} />
            </Link>

            {isMobile() ? this.renderMobile() : this.renderDesktop()}
          </Flex>
        </PageContainer>
      </Nav>
    )
  }
}

export default withRouter(Navbar)
