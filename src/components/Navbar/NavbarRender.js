import React from 'react'
import styled from 'styled-components'
import PageContainer from 'components/PageContainer'
import BlockConfirmationSrc from 'images/block-confirmation.svg'
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

import PendingTransaction from 'components/PendingTransaction'
import ClickOutSide from 'react-click-outside'

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

const DropdownButton = styled(Flex)`
  width: 40px;
  height: 40px;
  line-height: 30px;
  color: #fff;
  border-radius: 3px;
  z-index: 9999999;
  padding: 2px;
  cursor: pointer;
  transition: all 250ms;
  background: transparent;
  &:hover {
    background: #f0f2f9;
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

export default ({
  balance,
  isBND,
  toggleBalance,
  showLogin,
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
            <Image src={LogoSrc} width={16} ml={4} />
            <Bold ml={[0, 3]}>Band Protocol</Bold>
          </Link>
          <Flex ml="auto">
            <Link dark="true" to="/create-community" px={1}>
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
              <ClickOutSide onClickOutside={onClickOutside}>
                <Flex flexDirection="row" mr={4} alignItems="center">
                  <Text mr={2} color="#8868ff" fontSize={0}>
                    My Balance:
                  </Text>
                  <Text mr={2} fontSize={0} color={colors.text.grey}>
                    {balance.pretty()}
                  </Text>
                  <HighlightBNDOrUSD isBND={isBND} toggle={toggleBalance} />
                  <DropdownButton onClick={toggleShowBlockTransactions}>
                    <Image src={BlockConfirmationSrc} width={30} height={30} />
                    {pending.length !== 0 && (
                      <Badge bg={colors.red}>
                        {pending.length > 9 ? '9+' : pending.length}
                      </Badge>
                    )}
                  </DropdownButton>
                  <ProfileImage src={LogoSrc} />
                </Flex>
                <BlockTransactions show={showBlockTransactions}>
                  <Text
                    block
                    size={14}
                    lineHeight={2.5}
                    weight="semibold"
                    color="#ffffff"
                    style={{
                      background: colors.purple.normal,
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
              <Button variant="primary" onClick={showLogin} mr={4}>
                Sign in
              </Button>
            )}
          </Flex>
        </Flex>
      </PageContainer>
    </Nav>
  )
}
