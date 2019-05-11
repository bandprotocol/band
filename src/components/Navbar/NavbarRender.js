import React from 'react'
import styled from 'styled-components'
import PageContainer from 'components/PageContainer'
import ethBlue from 'images/ethBlue.svg'
import Wallet from 'images/blueWallet.svg'
// import AddCommunity from 'images/add-community.svg'
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'
import { Link, Image, Flex, Box, Text, Card } from 'ui/common'
import media from 'ui/media'
import PendingTransaction from 'components/PendingTransaction'
import ClickOutSide from 'react-click-outside'
import LogoSrc from 'images/blueBandLogo.svg'
import { colors } from 'ui'

const Nav = styled.nav`
  display: flex;
  height: 60px;
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

const TextClickable = styled(Text)`
  cursor: pointer;
`

const SignIn = styled(Text).attrs({
  fontSize: '16px',
  fontWeight: '900',
  color: colors.purple.dark,
  mr: '40px',
})`
  cursor: pointer;

  &:hover {
    color: #322185;
  }
`

const HighlightBNDOrUSD = ({ isBND, toggle, showWallet }) => {
  return (
    <Flex justifyContent="center" alignItems="center">
      {isBND ? (
        <Text mr={0} color="#4a4a4a" fontSize="16px" fontWeight={500}>
          BND
        </Text>
      ) : (
        <TextClickable
          color="#d1d1d1"
          onClick={toggle}
          fontWeight={500}
          fontSize="16px"
        >
          BND
        </TextClickable>
      )}
      <Text px={1} color={colors.text.grey} fontSize="16px">
        |
      </Text>
      {isBND ? (
        <TextClickable
          onClick={toggle}
          color="#d1d1d1"
          fontWeight={500}
          fontSize="16px"
        >
          USD
        </TextClickable>
      ) : (
        <Text mr={0} color="#4a4a4a" fontSize="16px" fontWeight={500}>
          USD
        </Text>
      )}
      <Flex
        ml="10px"
        style={{ cursor: 'pointer' }}
        onClick={() => showWallet()}
      >
        <Image src={Wallet} width="20px" height="20px" />
      </Flex>
    </Flex>
  )
}

const DropdownButton = styled(Flex)`
  width: 40px;
  height: 40px;
  line-height: 30px;
  color: #fff;
  z-index: 9999999;
  cursor: pointer;
  border-radius: 50%;
  transition: all 250ms;
  background: transparent;
  &:hover {
    background: #f0f2f9;
    border-radius: 50%;
  }
`

const Badge = styled(Box)`
  box-sizing: border-box;
  height: 12px;
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
  top: 68px;
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
  top: 68px;
  right: 25px;
  background: #ffffff;
  width: 100px;
  transition: all 250ms;
  overflow: auto;
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

export default ({
  showWallet,
  showSignOut,
  toggleSignOut,
  signOut,
  user,
  balance,
  isBND,
  toggleBalance,
  txs,
  onClickOutside,
  showBlockTransactions,
  toggleShowBlockTransactions,
}) => {
  const pending =
    (txs &&
      txs.filter(tx => tx.status === 'SENDING' || tx.status === 'PENDING')) ||
    []
  return (
    <Nav>
      <PageContainer fullWidth>
        <Flex alignItems="center">
          <Link dark="true" to="/">
            <Image src={LogoSrc} width={166} ml={4} />
            {/* <Bold ml={[0, 3]}>Band Protocol</Bold> */}
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
            {balance !== undefined ? (
              <ClickOutSide onClickOutside={onClickOutside}>
                <Flex flexDirection="row" mr={4} alignItems="center">
                  <Flex
                    flexDirection="row"
                    alignItems="center"
                    justifyContent="space-between"
                    bg="#f2f4f9"
                    mr="20px"
                    pl="20px"
                    pr="10px"
                    style={{
                      minHeight: '40px',
                      borderRadius: '4px',
                      minWidth: '280px',
                    }}
                  >
                    <Text
                      mr={2}
                      fontSize="16px"
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
                      bg="#f8fafd"
                      alignItems="center"
                      style={{
                        height: '40px',
                        width: '40px',
                        borderRadius: '50%',
                      }}
                    >
                      <Image src={ethBlue} width={30} height={30} />
                      {pending.length !== 0 && <Badge bg={colors.red} />}
                    </Flex>
                  </DropdownButton>
                  <Flex
                    alignItems="center"
                    style={{ cursor: 'pointer' }}
                    onClick={() => toggleSignOut()}
                  >
                    <Flex ml="15px" mr="10px">
                      {!!user && (
                        <Jazzicon
                          diameter={40}
                          seed={jsNumberForAddress(user)}
                        />
                      )}
                    </Flex>
                    <Text color="#7688f4" fontSize={4}>
                      <i className="fas fa-sort-down" />
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
            ) : (
              <SignIn onClick={showWallet}>Sign in</SignIn>
            )}
          </Flex>
        </Flex>
      </PageContainer>
    </Nav>
  )
}
