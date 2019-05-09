import React, { useState, useEffect, useRef } from 'react'
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

import MenuDT from 'images/menu_dt.svg'
import MenuPDS from 'images/menu_pds.svg'
import MenuTCD from 'images/menu_tcd.svg'
import MenuTCR from 'images/menu-tcr.svg'
import MenuWallet from 'images/menu_wallet.svg'

import GovernancePortalImg from 'images/governancePortal.svg'
import DatasetExplorerImg from 'images/datasetExplorer.svg'

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
  pt: 4,
  flexDirection: 'column',
})`
  height: 100%;
  transition: all 0.25s;
  cursor: pointer;
  &:hover {
    background-color: #6b8bf5;
  }
`

const MainMenuText = styled(Text).attrs({
  color: 'white',
  fontSize: '20px',
})`
  font-size: 16px;
  transition: all 0.25s;
  &:hover {
    color: #bfcdff;
  }
`

const getImg = id =>
  [
    MenuDT,
    MenuTCD,
    MenuTCR,
    MenuWallet,
    MenuPDS,
    GovernancePortalImg,
    DatasetExplorerImg,
  ][id]

const NavMenu = ({ isSelected, title, tabs }) => {
  return (
    <Flex
      style={{
        width: '1000px',
        height: isSelected ? '405px' : '0px',
        position: 'absolute',
        left: '0',
        top: '80px',
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
        <Text color="#7c84a6" fontSize="20px">
          {title}
        </Text>
      </Flex>
      <Flex flexDirection="row" style={{ height: '100%' }}>
        {tabs.map((tab, i) => {
          const LinkComponent = tab.link ? Link : AbsoluteLink
          return (
            <LinkComponent
              to={tab.link}
              href={tab.href}
              key={i}
              style={{ flex: 1, textDecoration: 'none' }}
            >
              <SubMenu>
                <Flex style={{ minHeight: '70px' }} alignItems="center">
                  <Image src={getImg(tab.imgIndex)} height={tab.imgHeight} />
                </Flex>
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
            </LinkComponent>
          )
        })}
      </Flex>
    </Flex>
  )
}

const Navbar = props => {
  const [showMenu, setShowMenu] = useState(false)
  const [selectedTab, setSelectedTab] = useState(-1)
  const [scrollTop, setScrollTop] = useState(0)
  const [oldScrollTop, setOldScrollTop] = useState(0)
  const [deltaScroll, setDeltaScroll] = useState(0)

  const handleScroll = e => {
    setScrollTop(parseInt(e.target.scrollTop))
  }

  useEffect(() => {
    window.document.body.addEventListener('scroll', handleScroll)
    return () =>
      window.document.body.removeEventListener('scroll', handleScroll)
  }, [])

  const prevLocation = useRef()
  useEffect(() => {
    if (oldScrollTop !== scrollTop) {
      setDeltaScroll(scrollTop - oldScrollTop)
      setOldScrollTop(scrollTop)
    }
    if (props.location !== prevLocation.current) {
      setShowMenu(false)
      setSelectedTab(-1)
    }
    prevLocation.current = props.location
  })

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
            width: 'calc(100vw)',
            transition: 'all 400ms',
            background: '#202541',
            transform: showMenu ? '' : 'translateX(100%)',
            boxShadow: showMenu ? '-20px 0 50px 0 rgba(0, 0, 0, 0.25)' : 'none',
          }}
        >
          <Flex flexDirection="column">
            <Flex
              flex="0 0 60px"
              pr="26px"
              mb={4}
              alignItems="center"
              flexDirection="row"
            >
              <Image
                src={MenuCloseSrc}
                width="24px"
                style={{ marginLeft: 'auto' }}
                onClick={() => setShowMenu(false)}
              />
            </Flex>
            <Flex flex="0 0 60px" pr="26px" alignItems="center" pl={5}>
              <Link to="/why-band" onClick={() => setShowMenu(false)}>
                <SemiBold color="#fff" fontSize="18px">
                  Why Band?
                </SemiBold>
              </Link>
            </Flex>
            <Flex flex="0 0 60px" pr="26px" alignItems="center" pl={5}>
              <Link to="/products/tcd" onClick={() => setShowMenu(false)}>
                <SemiBold color="#fff" fontSize="18px">
                  Products
                </SemiBold>
              </Link>
            </Flex>
            <Flex flex="0 0 60px" pr="26px" alignItems="center" pl={5}>
              <AbsoluteLink
                href="https://medium.com/bandprotocol"
                onClick={() => setShowMenu(false)}
              >
                <SemiBold color="#fff" fontSize="18px">
                  Explorers
                </SemiBold>
              </AbsoluteLink>
            </Flex>
            <Flex flex="0 0 60px" pr="26px" alignItems="center" pl={5}>
              <Link to="/company" onClick={() => setShowMenu(false)}>
                <SemiBold color="#fff" fontSize="18px">
                  Company
                </SemiBold>
              </Link>
            </Flex>
            <Flex flex="0 0 60px" pr="26px" alignItems="center" pl={5}>
              <AbsoluteLink
                href="https://medium.com/bandprotocol"
                onClick={() => setShowMenu(false)}
              >
                <SemiBold color="#fff" fontSize="18px">
                  Blog
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
      <Flex alignItems="center" onMouseOver={() => selectTab(-1)}>
        <Box ml="40px">
          <Link to="/why-band">
            <MainMenuText>Why Band?</MainMenuText>
          </Link>
        </Box>
        <Flex
          alignItems="center"
          style={{ height: '100%' }}
          ml="40px"
          onMouseOver={e => {
            e.stopPropagation()
            selectTab(0)
          }}
        >
          <Flex flexDirection="row" color="white" style={{ cursor: 'pointer' }}>
            <MainMenuText>Products</MainMenuText>
            <Text ml={2} pt="2px" color="#6b8bf5" fontSize="12px">
              <i className="fas fa-chevron-down" />
            </Text>
          </Flex>
          <NavMenu
            isSelected={selectedTab === 0}
            title="Products"
            tabs={[
              {
                title: 'Data Tokenization',
                link: '/products/data-tokenization',
                imgIndex: 0,
                imgHeight: '46px',
                content: `Standard tokenization frameworks and incentive stuctures for data in Web 3.0`,
              },
              {
                title: 'Token Curated DataSources',
                link: '/products/tcd',
                imgIndex: 1,
                imgHeight: '67px',
                content: `Build robust, decentralized data feed from a network of data providers`,
              },
              {
                title: 'Token Curated Registries',
                link: '/products/tcr',
                imgIndex: 2,
                imgHeight: '28px',
                content: `Build reliable, more transparent crowd-source information through crypto-incentized data curation`,
              },
              {
                title: 'Band Web3 Wallet',
                link: '/products/wallet',
                imgIndex: 3,
                imgHeight: '49px',
                content: `An all-in-one, UX optimized Web3 wallet for Ethereum DApps`,
              },
              {
                title: 'Private Data Sharing',
                link: '/products/private-sharing',
                imgIndex: 4,
                imgHeight: '47px',
                content: `Platform for businesses to share and monetize data off-chain with on-chain cryptographic verification`,
              },
            ]}
          />
        </Flex>
        <Flex
          alignItems="center"
          style={{ height: '100%' }}
          ml="40px"
          onMouseOver={e => {
            e.stopPropagation()
            selectTab(1)
          }}
        >
          <Flex flexDirection="row" color="white" style={{ cursor: 'pointer' }}>
            <MainMenuText>Explorers</MainMenuText>
            <Text ml={2} pt="2px" color="#6b8bf5" fontSize="12px">
              <i className="fas fa-chevron-down" />
            </Text>
          </Flex>
          <NavMenu
            isSelected={selectedTab === 1}
            title="Explorers"
            tabs={[
              {
                title: 'Governance Portal',
                href: 'https://data.bandprotocol.com',
                imgIndex: 5,
                imgHeight: '50px',
                content: `Join data curation community, stake tokens on data prodicers and vote on governance parameters`,
              },
              {
                title: 'Dataset Explorer',
                href: 'https://data.bandprotocol.com',
                imgIndex: 6,
                imgHeight: '46px',
                content: `Explore dataset availables by Band Protocol and learn how to integrate with the DApps`,
              },
            ]}
          />
        </Flex>
        <Box ml="40px">
          <Link to="/company">
            <MainMenuText>Company</MainMenuText>
          </Link>
        </Box>
        <Box ml="40px">
          <AbsoluteLink target="_blank" to="https://medium.com/bandprotocol">
            <MainMenuText>Blog</MainMenuText>
          </AbsoluteLink>
        </Box>
      </Flex>
    )
  }

  return (
    <Nav
      style={{
        transition: 'all 350ms',
        position: 'sticky',
        transform: `translateY(${
          deltaScroll <= 0 || scrollTop < 80 ? '0px' : '-80px'
        })`,
      }}
    >
      <Flex
        bg="#2a304e"
        m={['-20px', '0px']}
        style={{
          position: 'absolute',
          width: '100vw',
          height: '100vh',
          top: '80px',
          opacity: showMenu ? 0.5 : 0,
          pointerEvents: showMenu ? 'all' : 'none',
          transition: 'all 0.5s',
        }}
        onClick={() => selectTab(-1)}
        onMouseOver={() => selectTab(-1)}
      />
      <Flex
        bg={showMenu ? '#252b4a' : 'rgba(0,0,0,0)'}
        style={{
          margin: '0 auto',
          height: '100%',
          width: '1000px',
          transition: 'all 0.5s',
          position: 'relative',
        }}
        px="30px"
        alignItems="center"
      >
        <Flex width={1}>
          <Flex style={{ minWidth: '180px' }}>
            <Link dark to="/">
              <Image src={LogoSrc} height={32} mr={3} />
            </Link>
          </Flex>
          <Flex width={1} justifyContent="flex-end">
            {isMobile() ? renderMobile() : renderDesktop()}
          </Flex>
        </Flex>
      </Flex>
    </Nav>
  )
}

export default withRouter(Navbar)
