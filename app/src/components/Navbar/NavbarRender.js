import React from 'react'
import styled from 'styled-components'
import PageContainer from 'components/PageContainer'
import { Link, Image, Flex, Box, Text, Card } from 'ui/common'
import ClickOutSide from 'react-click-outside'
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'
import PendingTransaction from 'components/PendingTransaction'
import media from 'ui/media'
import { colors } from 'ui'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSortDown } from '@fortawesome/free-solid-svg-icons'

// import AddCommunity from 'images/add-community.svg'
import Eth from 'images/eth.svg'
import Wallet from 'images/blueWallet.svg'
// Dashboard Page
import WhiteLogoSrc from 'images/logo-white.png'

// Other Page
import LogoSrc from 'images/logo-dark.png'
import CircleLoadingSpinner from 'components/CircleLoadingSpinner'

const Nav = styled.nav`
  display: flex;
  height: 60px;
  width: 100%;
  align-items: center;
  box-shadow: 0 1px 8px 0 rgba(0, 0, 0, 0.07);
  top: 0px;
  transform: translateY(${p => (p.showNav ? '0' : '-60')}px);
  z-index: 5;

  transition: transform 200ms;

  ${p =>
    p.isDashboard
      ? `
      background: unset;
      box-shadow: 0 0 0 0 #000000;
      position: relative;
    `
      : `
      background: #ffffff;
      box-shadow: 0 1px 8px 0 rgba(0, 0, 0, 0.07);
      position: absolute;
    `}

  ${media.mobile} {
    height: 60px;
    padding: 0 8px;
  }
`

const TextClickable = styled(Text)`
  cursor: pointer;
`

const SignIn = styled(Text).attrs({
  fontSize: '15px',
  fontWeight: '600',
  mr: '40px',
})`
  cursor: pointer;
  color: ${p => (p.isDashboard ? '#ffffff' : '#4d5cbd')};

  &:hover {
    color: ${p => (p.isDashboard ? '#a6b2ff' : '#2972fb')};
  }
`

const HighlightBNDOrUSD = ({ isBND, toggle, showWallet }) => {
  return (
    <Flex justifyContent="center" alignItems="center">
      {isBND ? (
        <Text mr={0} color="#4a4a4a" fontSize="15px" fontWeight={500}>
          BND
        </Text>
      ) : (
        <TextClickable
          color="#b8c1dd"
          onClick={toggle}
          fontWeight={500}
          fontSize="15px"
        >
          BND
        </TextClickable>
      )}
      <Box
        width="1px"
        bg={colors.text.graph}
        mx={1}
        style={{ height: '20px' }}
      ></Box>
      {isBND ? (
        <TextClickable
          onClick={toggle}
          color="#b8c1dd"
          fontWeight={500}
          fontSize="15px"
        >
          USD
        </TextClickable>
      ) : (
        <Text mr={0} color="#4a4a4a" fontSize="15px" fontWeight={500}>
          USD
        </Text>
      )}
      <Flex
        ml={3}
        mr={1}
        mb={0}
        style={{ cursor: 'pointer' }}
        onClick={() => showWallet()}
      >
        <Image src={Wallet} width="20px" height="20px" />
      </Flex>
    </Flex>
  )
}

const DropdownButton = styled(Flex)`
  width: 36px;
  height: 36px;
  color: #fff;
  border-radius: 50%;
  z-index: 9999999;
  cursor: pointer;
  border-radius: 50%;
  transition: all 250ms;
  border-radius: 50%;
  &:hover {
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.07);
  }
`

const Badge = styled(Box)`
  box-sizing: border-box;
  height: 10px;
  width: 12px;
  line-height: 12px;
  text-align: center;
  color: #fff;
  font-size: 8px;
  border-radius: 50%;
  font-weight: 300;
  align-self: flex-end;
  margin-left: -10px;
`

const BlockTransactions = styled(Card).attrs({
  boxShadow:
    '0 2px 16px 0 rgba(33, 43, 54, 0.08), 0 14px 18px 0 rgba(0, 0, 0, 0.07)',
  borderRadius: 4,
  padding: 3,
})`
  position: absolute;
  top: 55px;
  right: 25px;
  background: #ffffff;
  width: 366px;
  transition: all 250ms;
  overflow: auto;
  max-height: 600px;
  ${p =>
    p.show
      ? `
    opacity: 1;
  `
      : `
    opacity: 0;
    pointer-events: none;
  `}
`

const SignOutDropDown = styled(Card).attrs({
  boxShadow:
    '0 2px 16px 0 rgba(33, 43, 54, 0.08), 0 14px 18px 0 rgba(0, 0, 0, 0.07)',
  borderRadius: 4,
  padding: 3,
})`
  text-align: center;
  line-height: 30px;
  position: absolute;
  top: 45px;
  right: 25px;
  background: #ffffff;
  width: 100px;
  transition: all 250ms;
  border: 1px solid #d9dce1;
  ${p =>
    p.show
      ? `
  opacity: 1;
`
      : `
  opacity: 0;
  pointer-events: none;
`}

  &:before {
    position: absolute;
    content: '';
    width: 0;
    height: 0;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-bottom: 8px solid #d9dce1;
    top: -8px;
    right: 4px;
  }

  &:after {
    position: absolute;
    content: '';
    width: 0;
    height: 0;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-bottom: 8px solid white;
    top: -7px;
    right: 4px;
  }
`

export default ({
  showWallet,
  showSignOut,
  toggleSignOut,
  signOut,
  user,
  balance,
  isBND,
  showNav,
  toggleBalance,
  txs,
  onClickOutside,
  showBlockTransactions,
  toggleShowBlockTransactions,
}) => {
  const pending =
    (txs &&
      txs.filter(
        tx =>
          tx.status === 'SENDING' ||
          tx.status === 'PENDING' ||
          tx.status === 'WAIT_CONFIRM',
      )) ||
    []

  const isDashboard = document.location.pathname === '/'
  return (
    <Nav isDashboard={isDashboard} showNav={showNav}>
      <PageContainer fullWidth>
        <Flex alignItems="center">
          <Link dark="true" to="/">
            <Flex
              justifyContent="center"
              alignItems="center"
              style={{ height: 60, width: 220 }}
            >
              {isDashboard ? (
                <Image src={WhiteLogoSrc} height="32px" />
              ) : (
                <Image src={LogoSrc} height="32px" />
              )}
            </Flex>
          </Link>
          <Flex ml="auto">
            {/* <Link dark="true" to="/create-community" px={1}>
              <Flex px={3} alignItems="center">
                <Image src={AddCommunity} width={18} height={18} mx="8px" />
                <Text color="#4a4a4a" fontWeight="500" fontSize="16px">
                  Create Community
                </Text>
              </Flex>
            </Link> */}
            {user && user.length === 42 ? (
              <ClickOutSide
                onClickOutside={onClickOutside}
                style={{ position: 'relative' }}
              >
                <Flex flexDirection="row" mr={4} alignItems="center">
                  <Flex
                    flexDirection="row"
                    alignItems="center"
                    justifyContent="space-between"
                    bg="#F8FAFD"
                    mr="20px"
                    pl="20px"
                    pr="10px"
                    style={{
                      minHeight: '40px',
                      borderRadius: '20px',
                      minWidth: '280px',
                    }}
                  >
                    <Text
                      mr={2}
                      fontSize="15px"
                      fontWeight={500}
                      color="#4a4a4a"
                    >
                      {balance.pretty()}
                    </Text>
                    <HighlightBNDOrUSD
                      isBND={isBND}
                      toggle={toggleBalance}
                      showWallet={showWallet}
                    />
                  </Flex>
                  <DropdownButton onClick={toggleShowBlockTransactions}>
                    <Flex
                      justifyContent="center"
                      alignItems="center"
                      bg="#f8fafd"
                      style={{
                        borderRadius: '50%',
                        width: '36px',
                        height: '36px',
                      }}
                    >
                      <Image src={Eth} width={27} height={27} />
                    </Flex>
                    {pending.length !== 0 && <Badge bg={colors.red} />}
                  </DropdownButton>
                  <Flex
                    alignItems="center"
                    style={{ cursor: 'pointer' }}
                    onClick={() => toggleSignOut()}
                  >
                    <Flex ml="15px" mr="10px">
                      {!!user && (
                        <Jazzicon
                          diameter={32}
                          seed={jsNumberForAddress(user)}
                        />
                      )}
                    </Flex>
                    <Text
                      color={isDashboard ? '#fff' : colors.blue.normal}
                      fontSize={3}
                    >
                      <FontAwesomeIcon icon={faSortDown} />
                    </Text>
                  </Flex>
                </Flex>
                <SignOutDropDown show={showSignOut}>
                  <Text
                    block
                    size={14}
                    color="#7688f4"
                    style={{ cursor: 'pointer' }}
                    onClick={signOut}
                  >
                    Sign Out
                  </Text>
                </SignOutDropDown>
                <BlockTransactions show={showBlockTransactions}>
                  <Text
                    block
                    size={14}
                    lineHeight={2.5}
                    weight="semibold"
                    color="#ffffff"
                    style={{
                      background: colors.blue.normal,
                      position: 'sticky',
                      top: 0,
                      paddingLeft: 16,
                    }}
                  >
                    Pending Transaction ({txs && txs.length})
                  </Text>
                  <Box px={3} pb={3} pt={3}>
                    {txs &&
                      txs.map((txn, i) => (
                        <PendingTransaction key={i} {...txn} />
                      ))}
                  </Box>
                </BlockTransactions>
              </ClickOutSide>
            ) : user === 'NOT_SIGNIN' ? (
              <SignIn onClick={showWallet} isDashboard={isDashboard}>
                Sign in
              </SignIn>
            ) : (
              <CircleLoadingSpinner radius="40px" color="red" />
            )}
          </Flex>
        </Flex>
      </PageContainer>
    </Nav>
  )
}
