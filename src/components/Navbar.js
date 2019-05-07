import React, { useState } from 'react'
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

const SubMenu = styled(Flex).attrs({
  px: '20px',
  py: '35px',
  flexDirection: 'column',
})`
  transition: all 0.25s;
  cursor: pointer;
  &:hover {
    background-color: #6b8bf5;
  }
`

const NavMenu = ({ isSelected, title, links, tabs }) => {
  return (
    <Flex
      style={{
        width: '940px',
        height: isSelected ? '405px' : '0px',
        position: 'fixed',
        left: '50%',
        top: '80px',
        marginLeft: '-470px',
        transition: 'all 0.25s',
        opacity: isSelected ? 1 : 0,
        pointerEvents: isSelected ? 'all' : 'none',
      }}
      bg="#202541"
      flexDirection="column"
    >
      <Flex
        style={{ height: '70px', borderBottom: '1px solid #7c84a6' }}
        px="30px"
        alignItems="center"
      >
        <Link to={links[0]}>
          <Text color="#7c84a6" fontSize="20px">
            {title}
          </Text>
        </Link>
      </Flex>
      <Flex flexDirection="row" style={{ height: '100%' }}>
        {tabs.map((tab, i) => {
          return (
            <SubMenu flex={1}>
              <Text color="white" fontSize="40px">
                {i + 1}
              </Text>
              <Flex mt="80px" style={{ height: '60px' }}>
                <Text
                  color="white"
                  fontWeight={500}
                  fontSize="14px"
                  lineHeight={1.5}
                >
                  {tab.title}
                </Text>
              </Flex>
              <Text
                color="white"
                fontWeight={300}
                fontSize="13px"
                lineHeight={1.69}
              >
                {tab.content}
              </Text>
            </SubMenu>
          )
        })}
      </Flex>
    </Flex>
  )
}

const Navbar = props => {
  const [showMenu, setShowMenu] = useState(false)
  const [selectedTab, setSelectedTab] = useState(-1)

  const selectTab = tabId => {
    setSelectedTab(tabId)
    setShowMenu(tabId >= 0)
  }

  const renderMobile = () => {
    return (
      <React.Fragment>
        <Image
          src={MenuBurgerSrc}
          width="24px"
          style={{ marginLeft: 'auto' }}
          onClick={() => setShowMenu(true)}
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
            transform: showMenu ? '' : 'translateX(100%)',
            boxShadow: showMenu ? '-20px 0 50px 0 rgba(0, 0, 0, 0.25)' : 'none',
          }}
        >
          <Flex flexDirection="column">
            <Flex flex="0 0 60px" pr="26px" mb={4} alignItems="center">
              <Image
                src={MenuCloseSrc}
                width="24px"
                style={{ marginLeft: 'auto' }}
                onClick={() => setShowMenu(false)}
              />
            </Flex>
            <Flex flex="0 0 60px" pr="26px" alignItems="center" pl={5}>
              <AbsoluteLink
                href="https://app.bandprotocol.com"
                onClick={() => setShowMenu(false)}
              >
                <SemiBold color="#fff" fontSize="18px">
                  Application
                </SemiBold>
              </AbsoluteLink>
            </Flex>
            <Flex flex="0 0 60px" pr="26px" alignItems="center" pl={5}>
              <Link to="/developers" onClick={() => setShowMenu(false)}>
                <SemiBold color="#fff" fontSize="18px">
                  Developers
                </SemiBold>
              </Link>
            </Flex>
            <Flex flex="0 0 60px" pr="26px" alignItems="center" pl={5}>
              <Link to="/about" onClick={() => setShowMenu(false)}>
                <SemiBold color="#fff" fontSize="18px">
                  About
                </SemiBold>
              </Link>
            </Flex>
            <Flex flex="0 0 60px" pr="26px" alignItems="center" pl={5}>
              <AbsoluteLink
                target="_self"
                to="mailto:connect@bandprotocol.com"
                onClick={() => setShowMenu(false)}
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

  const renderDesktop = () => {
    const { pathname } = props.location
    return (
      <Flex ml="auto" style={{ position: 'relative' }}>
        <Box ml="40px">
          <Link to="/why-band">
            <Text fontSize="16px">Why Band?</Text>
          </Link>
        </Box>
        <Box ml="40px" onMouseOver={() => selectTab(0)}>
          <Flex flexDirection="row" color="white" style={{ cursor: 'pointer' }}>
            <Text fontSize="16px">Products</Text>
            <Flex mx="2px" />
            <Text pt="2px" color="#6b8bf5" fontSize="12px">
              <i className="fas fa-chevron-down" />
            </Text>
          </Flex>
          <NavMenu
            isSelected={selectedTab === 0}
            title="Products"
            links={['/products/tcd']}
            tabs={[
              {
                title: 'Data Tokenization',
                content: `Spicy jalapeno bacon
            ipsum dolor amet pork
            chop short loin meatball
            fatback capicola.`,
              },
              {
                title: 'Token Curated DataSources',
                content: `Spicy jalapeno bacon
            ipsum dolor amet pork
            chop short loin meatball
            fatback capicola.`,
              },
              {
                title: 'Token Curated Registries',
                content: `Spicy jalapeno bacon
            ipsum dolor amet pork
            chop short loin meatball
            fatback capicola.`,
              },
              {
                title: 'Band Web3 Wallet',
                content: `Spicy jalapeno bacon
            ipsum dolor amet pork
            chop short loin meatball
            fatback capicola.`,
              },
              {
                title: 'Private Data Sharing',
                content: `Spicy jalapeno bacon
            ipsum dolor amet pork
            chop short loin meatball
            fatback capicola.`,
              },
            ]}
          />
        </Box>
        <Box ml="40px" onMouseOver={() => selectTab(1)}>
          <Flex flexDirection="row" color="white" style={{ cursor: 'pointer' }}>
            <Text fontSize="16px">Explorers</Text>
            <Flex mx="2px" />
            <Text pt="2px" color="#6b8bf5" fontSize="12px">
              <i className="fas fa-chevron-down" />
            </Text>
          </Flex>
          <NavMenu
            isSelected={selectedTab === 1}
            title="Explorers"
            links={['/explorers']}
            tabs={[
              {
                title: 'Governance Portal',
                content: `Spicy jalapeno bacon
            ipsum dolor amet pork
            chop short loin meatball
            fatback capicola.`,
              },
              {
                title: 'Dataset Explorer',
                content: `Spicy jalapeno bacon
            ipsum dolor amet pork
            chop short loin meatball
            fatback capicola.`,
              },
            ]}
          />
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

  return (
    <Nav>
      <PageContainer>
        <Flex
          bg="#2a304e"
          style={{
            position: 'fixed',
            width: '100%',
            height: '100%',
            top: '80px',
            left: '0px',
            opacity: showMenu ? 0.5 : 0,
            pointerEvents: showMenu ? 'all' : 'none',
            transition: 'all 0.5s',
          }}
          onClick={() => selectTab(-1)}
          onMouseOver={() => selectTab(-1)}
        />
        <Flex alignItems="center">
          <Link dark to="/">
            <Image src={LogoSrc} height={32} mr={3} />
          </Link>

          {isMobile() ? renderMobile() : renderDesktop()}
        </Flex>
      </PageContainer>
    </Nav>
  )
}

export default withRouter(Navbar)
