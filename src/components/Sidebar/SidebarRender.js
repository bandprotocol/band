import React from 'react'
import colors from 'ui/colors'
import styled from 'styled-components'

import { Image, Flex, Text, Bold, HighlightNavLink } from 'ui/common'
import CircleLoadingSpinner from 'components/CircleLoadingSpinner'

// Images inactive
import DetailSrc from 'images/detail.svg'
import RewardSrc from 'images/reward.svg'
import GovernanceSrc from 'images/governance.svg'
import ProposalSrc from 'images/vote.svg'

// Image active
import DetailActiveSrc from 'images/detailPurple.svg'
import RewardActiveSrc from 'images/rewardPurple.svg'
import GovernanceActiveSrc from 'images/governancePurple.svg'
import ProposalActiveSrc from 'images/votePurple.svg'

const Left = styled.div`
  width: 275px;
  height: calc(100vh - 80px);
  display: flex;
  flex-direction: column;
  background: #ffffff;
  position: sticky;
  top: 80px;
  box-shadow: 1px 0 2px 0 rgba(0, 0, 0, 0.05);
`

const TextClickable = styled(Text)`
  cursor: pointer;
`

const Tab = ({ link, imgSrcActive, imgSrcInactive, children }) => (
  <HighlightNavLink to={link} activeClassName="is-active">
    <Flex flexDirection="row" alignItems="center" py={3} pl={4}>
      <Image
        className="img-active"
        src={imgSrcActive}
        width="25px"
        height="25px"
      />
      <Image
        className="img-inactive"
        src={imgSrcInactive}
        width="25px"
        height="25px"
      />
      <Text px={3}>{children}</Text>
    </Flex>
  </HighlightNavLink>
)

const HighlightSymbolOrUSD = ({ symbol, isSymbol, toggle }) => {
  return (
    <Flex ml={1} style={{ lineHeight: '15px' }}>
      {isSymbol ? (
        <Text mr={0} fontWeight="bold" color="#8868ff" fontSize="11px">
          {symbol}
        </Text>
      ) : (
        <TextClickable
          color={colors.text.grey}
          onClick={toggle}
          fontSize="11px"
        >
          {symbol}
        </TextClickable>
      )}
      <Text px={0} color={colors.text.grey} fontSize="11px">
        /
      </Text>
      {isSymbol ? (
        <TextClickable
          color={colors.text.grey}
          onClick={toggle}
          fontSize="11px"
        >
          USD
        </TextClickable>
      ) : (
        <Text mr={0} fontWeight="bold" color="#8868ff" fontSize="11px">
          USD
        </Text>
      )}
    </Flex>
  )
}

export default ({
  logedin,
  name,
  src,
  balance,
  symbol,
  isSymbol,
  toggleBalance,
}) => (
  <Left>
    <Flex flexDirection="column" alignItems="center" py={3}>
      <Image src={src} width="80px" height="80px" m={3} borderRadius="50%" />
      <Text
        py={1}
        fontSize={0}
        fontWeight={500}
        style={{ textTransform: 'uppercase' }}
      >
        {name}
      </Text>
      <Flex flexDirection="row" alignItems="flex-end" py={1}>
        {!logedin ? null : balance === undefined ? (
          <CircleLoadingSpinner radius="25px" />
        ) : (
          <React.Fragment>
            <Text color={colors.text.grey} fontSize={2}>
              {balance.pretty()}
            </Text>
            <HighlightSymbolOrUSD
              symbol={symbol}
              isSymbol={isSymbol}
              toggle={toggleBalance}
            />
          </React.Fragment>
        )}
      </Flex>
      <Flex flexDirection="column" py={5} width={[1]}>
        <Bold px={4} pb={3} fontSize={0}>
          MENU
        </Bold>
        <Text fontSize={0} fontWeight={500}>
          <Tab
            link={`/community/${name}/detail`}
            imgSrcActive={DetailActiveSrc}
            imgSrcInactive={DetailSrc}
          >
            Detail
          </Tab>
          <Tab
            link={`/community/${name}/reward`}
            imgSrcActive={RewardActiveSrc}
            imgSrcInactive={RewardSrc}
          >
            Reward
          </Tab>
          <Tab
            link={`/community/${name}/governance`}
            imgSrcActive={GovernanceActiveSrc}
            imgSrcInactive={GovernanceSrc}
          >
            Governance
          </Tab>
          <Tab
            link={`/community/${name}/proposal`}
            imgSrcActive={ProposalActiveSrc}
            imgSrcInactive={ProposalSrc}
          >
            Proposal
          </Tab>
        </Text>
      </Flex>
    </Flex>
  </Left>
)
