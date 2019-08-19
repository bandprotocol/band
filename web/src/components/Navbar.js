import React, { useState, useEffect, useRef, useCallback } from 'react'
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

import LogoSrc from 'images/logo.png'
import MenuBurgerSrc from 'images/menu-burger.svg'
import MenuCloseSrc from 'images/menu-close.svg'

import MenuDT from 'images/menu_dt.svg'
import MenuPDS from 'images/menu_pds.svg'
import MenuTCD from 'images/menu_tcd.svg'
import MenuTCR from 'images/menu-tcr.svg'
import MenuWallet from 'images/menu_wallet.svg'

import GovernancePortalImg from 'images/governancePortal.svg'
import DatasetExplorerImg from 'images/datasetExplorer.png'

const Nav = styled.nav`
  display: flex;
  height: 70px;
  align-items: center;
  position: sticky;
  top: 0;
  backgroundImage: linear-gradient(to bottom, #5a7ffd,#0473bf)
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
  pt: [3, 3, 4],
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
  const [currentTab, setCurrentTab] = useState(-1)
  return (
    <Flex
      flexDirection="column"
      style={{
        width: '100vw',
        height: isSelected ? '350px' : '0px',
        position: 'absolute',
        left: '0',
        top: '70px',
        transition: 'all 0.25s',
        opacity: isSelected ? 1 : 0,
        pointerEvents: isSelected ? 'all' : 'none',
        backgroundImage: 'linear-gradient(to bottom, #5a7ffd, #495fd6)',
      }}
    >
      {/* <Flex
        style={{ height: '70px', borderBottom: '1px solid #7c84a6' }}
        px="30px"
        alignItems="center"
        py="10px"
      >
        <Text color="#7c84a6" fontSize="20px">
          {title}
        </Text>
      </Flex> */}
      <Flex flexDirection="row" style={{ height: '100%' }}>
        {tabs.map((tab, i) => {
          const LinkComponent = tab.link ? Link : AbsoluteLink
          const imgIndex = Array.isArray(tab.imgIndex)
            ? tab.imgIndex[currentTab === i && tab.imgIndex.length > 0 ? 1 : 0]
            : tab.imgIndex
          return (
            <LinkComponent
              to={tab.link}
              href={tab.href}
              key={i}
              style={{ flex: 1, textDecoration: 'none' }}
              onMouseOver={() => setCurrentTab(i)}
              onMouseLeave={() => setCurrentTab(-1)}
            >
              <SubMenu>
                <Flex style={{ minHeight: '70px' }} alignItems="center">
                  <Image src={getImg(imgIndex)} height={tab.imgHeight} />
                </Flex>
                <Flex mt={['30px', '30px', '70px']} style={{ height: '60px' }}>
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

const SubMenuMobile = ({
  closeMenu,
  link,
  isAbsolute,
  imgIndex,
  imgHeight,
  title,
  description,
}) => {
  return isAbsolute ? (
    <AbsoluteLink to={link} onClick={closeMenu}>
      <Flex
        flexDirection="column"
        alignItems="flex-start"
        style={{ maxWidth: '220px' }}
        mb="50px"
      >
        <Image src={getImg(imgIndex)} height={imgHeight} />
        <SemiBold color="#fff" fontSize="14px" mt="30px">
          {title}
        </SemiBold>
        <Text mt="20px" fontSize="13px" lineHeight={1.69}>
          {description}
        </Text>
      </Flex>
    </AbsoluteLink>
  ) : (
    <Link to={link} onClick={closeMenu}>
      <Flex
        flexDirection="column"
        alignItems="flex-start"
        style={{ maxWidth: '220px' }}
        mb="50px"
      >
        <Image src={getImg(imgIndex)} height={imgHeight} />
        <SemiBold color="#fff" fontSize="14px" mt="30px">
          {title}
        </SemiBold>
        <Text mt="20px" fontSize="13px" lineHeight={1.69}>
          {description}
        </Text>
      </Flex>
    </Link>
  )
}

const Navbar = props => {
  const [showMenu, setShowMenu] = useState(false)
  const [showTier2Index, setShowTier2Index] = useState(0)
  const [selectedTab, setSelectedTab] = useState(-1)
  const [showNav, setShowNav] = useState(true)

  const scrollHistory = useRef()
  const prevLocation = useRef()

  const handleScroll = useCallback(
    e => {
      if (e.target.documentElement.scrollTop < 80) return
      const newST = Math.floor(e.target.documentElement.scrollTop)
      if (!scrollHistory.current || scrollHistory.current.length === 0) {
        scrollHistory.current = [0]
      }
      if (scrollHistory.current.length === 1) {
        setShowNav(false)
      } else {
        if (
          scrollHistory.current[0] < scrollHistory.current[1] &&
          scrollHistory.current[1] > newST
        ) {
          setShowNav(true)
        } else if (
          scrollHistory.current[0] > scrollHistory.current[1] &&
          scrollHistory.current[1] < newST
        ) {
          setShowNav(false)
        }
      }
      scrollHistory.current = [
        scrollHistory.current[scrollHistory.current.length - 1],
        newST,
      ]
    },
    [showNav],
  )

  useEffect(() => {
    if (props.location !== prevLocation.current) {
      setShowMenu(false)
      setSelectedTab(-1)
    }
    prevLocation.current = props.location
  })

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const selectTab = tabId => {
    setSelectedTab(tabId)
    setShowMenu(tabId >= 0)
  }

  const closeMenu = () => {
    setShowMenu(false)
    setShowTier2Index(0)
    window.scrollLeft = 0
  }

  const back = () => {
    setShowTier2Index(0)
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
            right: 0,
            top: '0px',
            height: '100vh',
            width: showMenu ? 'calc(100vw)' : '0px',
            transition: 'all 400ms',
            overflow: 'hidden',
            background: '#202541',
            transform: showMenu ? '' : 'translateX(100%)',
            boxShadow: showMenu ? '-20px 0 50px 0 rgba(0, 0, 0, 0.25)' : 'none',
            minHeight: '0px',
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
                width="20px"
                style={{ marginLeft: 'auto' }}
                onClick={closeMenu}
              />
            </Flex>
            <Flex flex="0 0 60px" pr="26px" alignItems="center" pl={5}>
              <Link to="/why-band" onClick={closeMenu}>
                <SemiBold color="#fff" fontSize="18px">
                  Why Band?
                </SemiBold>
              </Link>
            </Flex>
            <Flex
              flex="0 0 60px"
              pr="26px"
              alignItems="center"
              pl={5}
              onClick={() => setShowTier2Index(1)}
            >
              <SemiBold color="#fff" fontSize="18px">
                Products
              </SemiBold>
            </Flex>
            <Flex
              flex="0 0 60px"
              pr="26px"
              alignItems="center"
              pl={5}
              onClick={() => setShowTier2Index(2)}
            >
              <SemiBold color="#fff" fontSize="18px">
                Explorers
              </SemiBold>
            </Flex>
            <Flex flex="0 0 60px" pr="26px" alignItems="center" pl={5}>
              <Link to="/company" onClick={closeMenu}>
                <SemiBold color="#fff" fontSize="18px">
                  Company
                </SemiBold>
              </Link>
            </Flex>
            <Flex flex="0 0 60px" pr="26px" alignItems="center" pl={5}>
              <AbsoluteLink
                href="https://medium.com/bandprotocol"
                onClick={closeMenu}
              >
                <SemiBold color="#fff" fontSize="18px">
                  Blog
                </SemiBold>
              </AbsoluteLink>
            </Flex>
          </Flex>
          {/* product menu */}
          <Card
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              height: '100%',
              width: 'calc(100vw)',
              transition: 'all 400ms',
              overflow: 'auto',
              background: '#202541',
              transform: showTier2Index === 1 ? '' : 'translateX(100%)',
              minHeight: '0px',
              paddingBottom: '50px',
            }}
          >
            <Box flexDirection="column" style={{ minHeight: '0px' }}>
              <Flex
                flex="0 0 60px"
                pr="26px"
                mt="20px"
                mb={4}
                alignItems="center"
                flexDirection="row"
                style={{ cursor: 'pointer' }}
                pl="30px"
                onClick={back}
              >
                <Text fontSize="20px" color="white">
                  <i className="fas fa-chevron-left" />
                </Text>
                <Text fontSize="20px" color="white" ml="20px">
                  Product
                </Text>
              </Flex>
              <Flex flex="0 0 60px" pr="26px" alignItems="center" pl={5}>
                <SubMenuMobile
                  closeMenu={closeMenu}
                  link="/products/data-tokenization"
                  imgIndex={0}
                  imgHeight="46px"
                  title="Data Tokenization"
                  description={`Standard tokenization frameworks and incentive stuctures for data in Web 3.0`}
                />
              </Flex>
              <Flex flex="0 0 60px" pr="26px" alignItems="center" pl={5}>
                <SubMenuMobile
                  closeMenu={closeMenu}
                  link="/products/tcd"
                  imgIndex={1}
                  imgHeight="67px"
                  title="Token-Curated DataSources"
                  description={`Build robust, decentralized data feed from a network of data providers`}
                />
              </Flex>
              <Flex flex="0 0 60px" pr="26px" alignItems="center" pl={5}>
                <SubMenuMobile
                  closeMenu={closeMenu}
                  link="/products/tcr"
                  imgIndex={2}
                  imgHeight="28px"
                  title="Token-Curated Registry"
                  description={`Build reliable, more transparent crowdsourced information through token-incentivized data curation`}
                />
              </Flex>
              <Flex flex="0 0 60px" pr="26px" alignItems="center" pl={5}>
                <SubMenuMobile
                  closeMenu={closeMenu}
                  link="/products/wallet"
                  imgIndex={3}
                  imgHeight="49px"
                  title="Band Web3 Wallet"
                  description={`An all-in-one, UX optimized Web3 wallet for Ethereum DApps`}
                />
              </Flex>
              <Flex flex="0 0 60px" pr="26px" alignItems="center" pl={5}>
                <SubMenuMobile
                  closeMenu={closeMenu}
                  link="/products/private-sharing"
                  imgIndex={4}
                  imgHeight="47px"
                  title="Private Data Sharing"
                  description={`Platform for businesses to share and monetize data off-chain with on-chain cryptographic verification`}
                />
              </Flex>
            </Box>
          </Card>
          {/* explorer menu */}
          <Card
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              height: '100%',
              width: 'calc(100vw)',
              transition: 'all 400ms',
              overflow: 'auto',
              background: '#202541',
              transform: showTier2Index === 2 ? '' : 'translateX(100%)',
            }}
          >
            <Box flexDirection="column" style={{ minHeight: '0px' }}>
              <Flex
                flex="0 0 60px"
                pr="26px"
                mt="20px"
                mb={4}
                alignItems="center"
                flexDirection="row"
                style={{ cursor: 'pointer' }}
                pl="30px"
                onClick={back}
              >
                <Text fontSize="20px" color="white">
                  <i className="fas fa-chevron-left" />
                </Text>
                <Text fontSize="20px" color="white" ml="20px">
                  Explorers
                </Text>
              </Flex>
              <Flex flex="0 0 60px" pr="26px" alignItems="center" pl={5}>
                <SubMenuMobile
                  closeMenu={closeMenu}
                  link="https://app.bandprotocol.com"
                  isAbsolute={true}
                  imgIndex={5}
                  imgHeight="50px"
                  title="Governance Portal"
                  description={`Join data curation community, stake tokens on data prodicers and vote on governance parameters`}
                />
              </Flex>
              <Flex flex="0 0 60px" pr="26px" alignItems="center" pl={5}>
                <SubMenuMobile
                  closeMenu={closeMenu}
                  link="https://data.bandprotocol.com"
                  isAbsolute={true}
                  imgIndex={6}
                  imgHeight="46px"
                  title="Dataset Explorer"
                  description={`Explore dataset availables by Band Protocol and learn how to integrate with the DApps`}
                />
              </Flex>
            </Box>
          </Card>
        </Card>
      </React.Fragment>
    )
  }

  const renderDesktop = () => {
    // const { pathname } = props.location
    return (
      <Flex alignItems="center" onMouseOver={() => selectTab(-1)}>
        {/* Tab 1: Airdrop */}
        <Box ml={['20px', '20px', '40px']}>
          <AbsoluteLink
            style={{
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
            }}
            target="_blank"
            to="http://band-airdrop.surge.sh/tokenholder"
          >
            <MainMenuText style={{ whiteSpace: 'nowrap' }}>
              Airdrop
            </MainMenuText>
            <Flex
              bg="#ff5b84"
              color="white"
              p="3px 8px"
              fontSize="12px"
              justifyContent="center"
              alignItems="center"
              ml="5px"
              style={{ borderRadius: '10px' }}
            >
              Live
            </Flex>
          </AbsoluteLink>
        </Box>

        {/* Tab 2: Features */}
        <Flex
          alignItems="center"
          style={{ height: '100%' }}
          ml={['20px', '20px', '40px']}
          onMouseOver={e => {
            e.stopPropagation()
            selectTab(0)
          }}
        >
          <Flex flexDirection="row" color="white" style={{ cursor: 'pointer' }}>
            <MainMenuText>Features</MainMenuText>
            <Text ml={2} pt="2px" color="#4a4a4a" fontSize="12px">
              <i className="fas fa-chevron-down" />
            </Text>
          </Flex>
          <NavMenu
            isSelected={selectedTab === 0}
            title="Features"
            tabs={[
              {
                title: 'Overview',
                link: '/features/overview',
                imgIndex: 0,
                imgHeight: '46px',
                content: `Standard tokenization frameworks and incentive stuctures for data in Web 3.0`,
              },
              {
                title: 'Dual-Token Economics',
                link: '/features/dual-token',
                imgIndex: 1,
                imgHeight: '67px',
                content: `Build robust, decentralized data feed from a network of data providers`,
              },
              {
                title: 'Token-Curated DataSources',
                link: '/features/tcd',
                imgIndex: 2,
                imgHeight: '28px',
                content: `Build reliable, more transparent crowd-source information through crypto-incentized data curation`,
              },
              {
                title: 'Data Governance Portal',
                link: '/features/data-governance-portal',
                imgIndex: 3,
                imgHeight: '49px',
                content: `An all-in-one, UX optimized Web3 wallet for Ethereum DApps`,
              },
            ]}
          />
        </Flex>

        {/* Tab 3: For developer */}
        <Box ml={['20px', '20px', '40px']}>
          <Link to="/developer">
            <MainMenuText style={{ whiteSpace: 'nowrap' }}>
              For Developer
            </MainMenuText>
          </Link>
        </Box>

        {/* Tab 4: Company */}
        <Flex
          alignItems="center"
          style={{ height: '100%' }}
          ml={['20px', '20px', '40px']}
          onMouseOver={e => {
            e.stopPropagation()
            selectTab(1)
          }}
        >
          <Flex flexDirection="row" color="white" style={{ cursor: 'pointer' }}>
            <MainMenuText>Company</MainMenuText>
            <Text ml={2} pt="2px" color="#4a4a4a" fontSize="12px">
              <i className="fas fa-chevron-down" />
            </Text>
          </Flex>
          <NavMenu
            isSelected={selectedTab === 1}
            title="Company"
            tabs={[
              {
                title: 'Overview',
                link: '/company/overview',
                imgIndex: 5,
                imgHeight: '46px',
                content: `Standard tokenization frameworks and incentive stuctures for data in Web 3.0`,
              },
              {
                title: 'Career',
                link: '/company/career',
                // href: 'https://data.bandprotocol.com',
                imgIndex: 6,
                imgHeight: '46px',
                content: `Explore dataset made available by Band Protocol and learn how to integrate them with your dApps`,
              },
            ]}
          />
        </Flex>

        {/* Tab 5: Join Community */}
        <Flex
          alignItems="center"
          style={{ height: '100%' }}
          ml={['20px', '20px', '40px']}
          onMouseOver={e => {
            e.stopPropagation()
            selectTab(2)
          }}
        >
          <Flex flexDirection="row" color="white" style={{ cursor: 'pointer' }}>
            <MainMenuText>Join Community</MainMenuText>
            <Text ml={2} pt="2px" color="#4a4a4a" fontSize="12px">
              <i className="fas fa-chevron-down" />
            </Text>
          </Flex>
          <NavMenu
            isSelected={selectedTab === 2}
            title="Join Community"
            tabs={[
              {
                title: 'Developer Forum',
                href: 'https://forum.bandprotocol.com',
                imgIndex: 7,
                imgHeight: '46px',
                content: `Standard tokenization frameworks and incentive stuctures for data in Web 3.0`,
              },
              {
                title: 'Blog',
                href: 'https://medium.com/bandprotocol',
                imgIndex: 8,
                imgHeight: '46px',
                content: `Explore dataset made available by Band Protocol and learn how to integrate them with your dApps`,
              },
              {
                title: 'Social Media',
                imgIndex: 9,
                imgHeight: '46px',
                content: `Explore dataset made available by Band Protocol and learn how to integrate them with your dApps`,
              },
            ]}
          />
        </Flex>
      </Flex>
    )
  }

  return (
    <Nav
      style={{
        backgroundImage: 'linear-gradient(to bottom, #5a7ffd, #547bff)',
        width: '100vw',
        transition: 'all 350ms',
        position: 'fixed',
        transform: `translateY(${!showNav && !showMenu ? '-70px' : '0px'})`,
      }}
    >
      <Flex
        bg="#5a7ffd"
        m={['-20px', '0px']}
        style={{
          position: 'absolute',
          width: '100%',
          height: '100vh',
          top: '70px',
          opacity: showMenu ? 0.5 : 0,
          pointerEvents: showMenu ? 'all' : 'none',
          transition: 'all 0.5s',
        }}
        onClick={() => selectTab(-1)}
        onMouseOver={() => selectTab(-1)}
      />
      <Flex
        bg={showMenu ? '#5a7ffd' : 'rgba(0,0,0,0)'}
        style={{
          margin: '0 auto',
          height: '100%',
          width: '1000px',
          transition: 'all 0.5s',
          position: 'relative',
        }}
        px={[3, '30px']}
        alignItems="center"
      >
        <Flex width={1}>
          <Flex
            style={{ minWidth: '180px', zIndex: showTier2Index === 0 ? 1 : 0 }}
          >
            <Link to="/">
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
