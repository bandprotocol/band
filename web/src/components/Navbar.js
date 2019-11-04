import React, { useState, useEffect, useRef, useCallback } from 'react'
import styled from 'styled-components'
import {
  Link,
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
import Socialbar from 'components/Socialbar'

import LogoSrc from 'images/logo.png'
import MenuBurgerSrc from 'images/menu-burger.svg'
import MenuCloseSrc from 'images/menu-close.svg'
import Subscribe from 'components/Subscribe'

import MenuDT from 'images/menu_dt.svg'
import MenuPDS from 'images/menu_pds.svg'
import MenuPO from 'images/menu-product-overview.svg'
import MenuCO from 'images/menu-com-overview.svg'
import MenuTCD from 'images/menu-tcd.svg'
import MenuCareer from 'images/menu-career.svg'
import MenuBlog from 'images/menu-blog.svg'
import MenuDevForum from 'images/menu-dev-forum.svg'
import MenuSocialMedia from 'images/menu-social-media.svg'

import GovernancePortalImg from 'images/governancePortal.svg'
import DatasetExplorerImg from 'images/datasetExplorer.png'

const LinesText = styled(Text)`
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`

const Nav = styled.nav`
  display: flex;
  height: 60px;
  align-items: center;
  position: sticky;
  top: 0;
  background-color: linear-gradient(to bottom, #5a7ffd, #0473bf);
  z-index: 999;

  ${media.mobile} {
    height: 60px;
    padding: 0 8px;
  }

  a {
    color: #ffffff;

    &:hover {
      color: #495ecd;
    }
  }
`

const SubMenu = styled(Flex).attrs({
  px: '20px',
  pt: [3, '36px', '36px'],
  flexDirection: 'column',
})`
  height: 100%;
  transition: all 0.25s;
  cursor: pointer;
  &:hover {
    background-color: #6277e3;
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
    MenuPO,
    MenuDT,
    MenuTCD,
    GovernancePortalImg,
    MenuPDS,
    MenuCO,
    MenuCareer,
    MenuDevForum,
    MenuBlog,
    MenuSocialMedia,
    DatasetExplorerImg,
  ][id]

const NavMenu = ({ isSelected, title, tabs, match }) => {
  const [currentTab, setCurrentTab] = useState(-1)

  return (
    <Flex
      flexDirection="column"
      alignItems="center"
      style={{
        width: '100vw',
        height: isSelected ? '215px' : '0px',
        position: 'fixed',
        left: '0',
        top: '60px',
        transition: 'all 0.25s',
        fontFamily: 'bio-sans',
        opacity: isSelected ? 1 : 0,
        pointerEvents: isSelected ? 'all' : 'none',
        background: '#495ecd',
      }}
    >
      <Flex
        flexDirection="row"
        style={{ height: '100%', width: '100%', maxWidth: '1400px' }}
      >
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
              <SubMenu style={{ minWidth: '100%' }}>
                <Flex style={{ minHeight: '60px' }} alignItems="center">
                  {tab.hasInputBox ? (
                    <Flex style={{ minWidth: '100%' }}>
                      <Subscribe navbar />
                    </Flex>
                  ) : tab.hasSocialLink ? (
                    <Socialbar />
                  ) : (
                    <Image src={getImg(imgIndex)} height={tab.imgHeight} />
                  )}
                </Flex>
                <Flex mt={['20px', '20px', '30px']}>
                  <Text
                    color="white"
                    fontWeight={700}
                    fontSize="18px"
                    lineHeight={1.5}
                  >
                    {tab.title}
                  </Text>
                </Flex>
                <LinesText
                  color="white"
                  fontWeight={300}
                  fontSize="13px"
                  lineHeight={1.69}
                >
                  {tab.content}
                </LinesText>
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
  titleMT = '30px',
  title,
  description,
  children,
}) => {
  const Child = () => (
    <Flex
      flexDirection="column"
      alignItems="flex-start"
      style={{ maxWidth: '220px' }}
      mb="50px"
    >
      {children || <Image src={getImg(imgIndex)} height={imgHeight} />}
      <SemiBold color="#fff" fontSize="14px" mt={titleMT}>
        {title}
      </SemiBold>
      <Text mt="20px" color="#fff" fontSize="13px" lineHeight={1.69}>
        {description}
      </Text>
    </Flex>
  )
  return link ? (
    isAbsolute ? (
      <AbsoluteLink to={link} onClick={closeMenu || (() => false)}>
        <Child />
      </AbsoluteLink>
    ) : (
      <Link to={link} onClick={closeMenu || (() => false)}>
        <Child />
      </Link>
    )
  ) : (
    <Child />
  )
}

const Navbar = props => {
  const { location } = props
  const { pathname } = location

  const [showMenu, setShowMenu] = useState(true)
  const [showTier2Index, setShowTier2Index] = useState(0)
  const [selectedTab, setSelectedTab] = useState(-1)
  const [showNav, setShowNav] = useState(true)
  const [navOpa, setNavOpa] = useState(100)

  let prevScrollpos = window.pageYOffset
  window.onscroll = function() {
    let currentScrollPos = window.pageYOffset
    if (prevScrollpos > currentScrollPos) {
      setShowNav(true)
      setNavOpa(100)
    } else {
      setShowNav(false)
      setNavOpa(0)
    }
    prevScrollpos = currentScrollPos
  }

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
            background: '#495ecd',
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
            <Flex
              flex="0 0 60px"
              pr="26px"
              alignItems="center"
              pl={5}
              onClick={() => setShowTier2Index(1)}
            >
              <SemiBold color="#fff" fontSize="18px">
                Features
              </SemiBold>
            </Flex>

            <Flex flex="0 0 60px" pr="26px" alignItems="center" pl={5}>
              <Link to="/developer" onClick={closeMenu}>
                <SemiBold color="#fff" fontSize="18px">
                  For Developers
                </SemiBold>
              </Link>
            </Flex>

            <Flex
              flex="0 0 60px"
              pr="26px"
              alignItems="center"
              pl={5}
              onClick={() => setShowTier2Index(2)}
            >
              <SemiBold color="#fff" fontSize="18px">
                Company
              </SemiBold>
            </Flex>
            <Flex
              flex="0 0 60px"
              pr="26px"
              alignItems="center"
              pl={5}
              onClick={() => setShowTier2Index(3)}
            >
              <SemiBold color="#fff" fontSize="18px">
                Join Community
              </SemiBold>
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
              background: '#495ecd',
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
                  Features
                </Text>
              </Flex>
              <Flex flex="0 0 60px" pr="26px" alignItems="center" pl={5}>
                <SubMenuMobile
                  closeMenu={closeMenu}
                  link="/features/overview"
                  imgIndex={0}
                  imgHeight="40px"
                  title="Product Overview"
                  description={`Learn about Band Protocol and potential use cases of off-chain data on blockchain`}
                />
              </Flex>
              <Flex flex="0 0 60px" pr="26px" alignItems="center" pl={5}>
                <SubMenuMobile
                  closeMenu={closeMenu}
                  link="/features/dual-token"
                  imgIndex={1}
                  imgHeight="60px"
                  title="Dual-Token Economics"
                  description={`Build robust, decentralized data feed from a network of data providers`}
                />
              </Flex>
              <Flex flex="0 0 60px" pr="26px" alignItems="center" pl={5}>
                <SubMenuMobile
                  closeMenu={closeMenu}
                  link="/features/tcd"
                  imgIndex={2}
                  imgHeight="60px"
                  title="Token-Curated DataSources"
                  description={`Build reliable, more transparent crowd-source information through crypto-incentized data curation`}
                />
              </Flex>
              <Flex flex="0 0 60px" pr="26px" alignItems="center" pl={5}>
                <SubMenuMobile
                  closeMenu={closeMenu}
                  link="/features/data-governance-portal"
                  imgIndex={3}
                  imgHeight="50px"
                  title="Data Governance Portal"
                  description={`Join data governance community, stake tokens on data providers and secure network together`}
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
              background: '#495ecd',
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
                  Company
                </Text>
              </Flex>
              <Flex flex="0 0 60px" pr="26px" alignItems="center" pl={5}>
                <SubMenuMobile
                  closeMenu={closeMenu}
                  link="/company/about-us"
                  isAbsolute={false}
                  imgIndex={5}
                  imgHeight="50px"
                  title="Overview"
                  description={`Get to know our team and values`}
                />
              </Flex>
              <Flex flex="0 0 60px" pr="26px" alignItems="center" pl={5}>
                <SubMenuMobile
                  closeMenu={closeMenu}
                  link="/company/career"
                  isAbsolute={false}
                  imgIndex={6}
                  imgHeight="46px"
                  title="Career with Band"
                  description={`Excited about decentralization? Join our team on the mission to bring trusted data to blockchain`}
                />
              </Flex>
            </Box>
          </Card>
          {/* Join Community menu */}
          <Card
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              height: '100%',
              width: 'calc(100vw)',
              transition: 'all 400ms',
              overflow: 'auto',
              background: '#495ecd',
              transform: showTier2Index === 3 ? '' : 'translateX(100%)',
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
                  Join Community
                </Text>
              </Flex>
              {/* <Flex flex="0 0 60px" pr="26px" alignItems="center" pl={5}>
                <SubMenuMobile
                  closeMenu={closeMenu}
                  link="/company/about-us"
                  isAbsolute={false}
                  imgIndex={7}
                  imgHeight="50px"
                  title="Developer Forum"
                  description={`Discuss protocol improvements, troubleshoot integrations, and much more`}
                />
              </Flex> */}
              <Flex flex="0 0 60px" pr="26px" alignItems="center" pl={5}>
                <SubMenuMobile
                  closeMenu={closeMenu}
                  link="/company/career"
                  isAbsolute={false}
                  imgIndex={8}
                  imgHeight="46px"
                  title="Blog"
                  description={`Learn more in-depth about Band Protocol use cases,  economics, and technical discussions`}
                />
              </Flex>
              <Flex flex="0 0 60px" pr="26px" alignItems="center" pl={5}>
                <SubMenuMobile
                  closeMenu={closeMenu}
                  isAbsolute={false}
                  imgIndex={9}
                  imgHeight="46px"
                  title="Social Media"
                  description={`Follow all our social media channels to get the most up-to-date information on Band Protocol`}
                >
                  <Socialbar />
                </SubMenuMobile>
              </Flex>
              <Flex flex="0 0 60px" pr="26px" alignItems="center" pl={5}>
                <SubMenuMobile
                  isAbsolute={false}
                  imgIndex={9}
                  imgHeight="46px"
                  title="Subscribe for updates"
                  titleMT="50px"
                  description={`Don't miss any update on Band Protocol including tech progress, campaigns, local events and more`}
                >
                  <Subscribe column="true" />
                </SubMenuMobile>
              </Flex>
            </Box>
          </Card>
        </Card>
      </React.Fragment>
    )
  }

  const renderDesktop = () => {
    return (
      <Flex alignItems="center" onMouseOver={() => selectTab(-1)}>
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
                title: 'Product Overview',
                link: '/features/overview',
                imgIndex: 0,
                imgHeight: '30px',
                content: `Learn about Band Protocol and potential use cases of off-chain data on blockchain`,
              },
              {
                title: 'Dual-Token Economics',
                link: '/features/dual-token',
                imgIndex: 1,
                imgHeight: '50px',
                content: `Build robust, decentralized data feed from a network of data providers`,
              },
              {
                title: 'Token-Curated DataSources',
                link: '/features/tcd',
                imgIndex: 2,
                imgHeight: '60px',
                content: `Build reliable, more transparent crowd-source information through crypto-incentized data curation`,
              },
              {
                title: 'Data Governance Portal',
                link: '/features/data-governance-portal',
                imgIndex: 3,
                imgHeight: '50px',
                content: `Join data governance community, stake tokens on data providers and secure network together`,
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
                link: '/company/about-us',
                imgIndex: 5,
                imgHeight: '50px',
                content: `Get to know our team and values`,
              },
              {
                title: 'Career with Band',
                link: '/company/career',
                imgIndex: 6,
                imgHeight: '50px',
                content: `Excited about decentralization? Join our team on the mission to bring trusted data to blockchain`,
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
              // {
              //   title: 'Developer Forum',
              //   href: 'https://forum.bandprotocol.com',
              //   imgIndex: 7,
              //   imgHeight: '60px',
              //   content: `Discuss protocol improvements, troubleshoot integrations, and much more`,
              // },
              {
                title: 'Blog',
                href: 'https://medium.com/bandprotocol',
                imgIndex: 8,
                imgHeight: '50px',
                content: `Learn more in-depth about Band Protocol use cases,  economics, and technical discussions`,
              },
              {
                title: 'Social Media',
                imgIndex: 9,
                imgHeight: '35px',
                hasSocialLink: true,
                content: `Follow all our social media channels to get the most up-to-date information on Band Protocol`,
              },
              {
                title: 'Subscribe for updates',
                hasInputBox: true,
                content: `Don't miss any update on Band Protocol including tech progress, campaigns, local events and more`,
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
        transition: 'transform 350ms, opacity 500ms',
        position: 'fixed',
        opacity: navOpa,
        transform: `translateY(${!showNav && !showMenu ? '-60px' : '0px'})`,
        zIndex: 3,
      }}
    >
      <Flex
        bg="#5a7ffd"
        m={['-20px', '0px']}
        style={{
          position: 'absolute',
          width: '100%',
          height: '100vh',
          top: '60px',
          opacity: 0,
          pointerEvents: showMenu ? 'all' : 'none',
          transition: 'all 0.5s',
        }}
        onClick={() => selectTab(-1)}
        onMouseOver={() => selectTab(-1)}
      />
      <Flex
        style={{
          margin: '0 auto',
          height: '100%',
          width: '1400px',
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
