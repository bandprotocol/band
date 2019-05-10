import React from 'react'
import styled from 'styled-components'

import { Image, Flex, Text, Bold, HighlightNavLink } from 'ui/common'
import CircleLoadingSpinner from 'components/CircleLoadingSpinner'
import MockProfileSrc from 'images/mock-profile.svg'
import BalanceWallet from 'images/balanceWallet.svg'

// Images inactive
import DetailSrc from 'images/detailInactive.svg'
import GovernanceSrc from 'images/govInactive.svg'
import ProposalSrc from 'images/voteInactive.svg'
import DataProviderInactive from 'images/dataProviderInactive.svg'

// Image active
import DetailActiveSrc from 'images/detailActive.svg'
import GovernanceActiveSrc from 'images/govActive.svg'
import ProposalActiveSrc from 'images/voteActive.svg'
import DataProviderActive from 'images/dataProviderActive.svg'

const Left = styled.div`
  width: 275px;
  height: calc(100vh - 60px);
  display: flex;
  flex-direction: column;
  background: #5973e7;
  position: sticky;
  top: 60px;
  box-shadow: 1px 0 2px 0 rgba(0, 0, 0, 0.05);
`

const Tab = ({ link, imgSrcActive, imgSrcInactive, children }) => (
  <HighlightNavLink to={link} activeClassName="is-active">
    <Flex
      flexDirection="row"
      alignItems="center"
      py={3}
      my={1}
      pl={4}
      style={{ borderRadius: '22.5px' }}
    >
      <Image className="img-active" src={imgSrcActive} width="20px" />
      <Image className="img-inactive" src={imgSrcInactive} width="20px" />
      <Text px={3}>{children}</Text>
    </Flex>
  </HighlightNavLink>
)

export default ({
  logedin,
  name,
  src,
  balance,
  usdBalance,
  symbol,
  address,
  hasTcd,
}) => (
  <Left>
    <Flex flexDirection="column" alignItems="center" py={3}>
      <Image
        src={src || MockProfileSrc}
        width="80px"
        height="80px"
        m={3}
        borderRadius="50%"
      />
      <Flex mb="20px">
        <Text
          py={1}
          fontSize={0}
          fontWeight={500}
          color="white"
          style={{ textTransform: 'uppercase' }}
        >
          {name}
        </Text>
      </Flex>
      {!logedin ? null : balance === undefined ? (
        <CircleLoadingSpinner radius="25px" />
      ) : (
        <Flex
          bg="#95a3e1"
          width="90%"
          flexDirection="column"
          justifyContent="center"
          px={4}
          py="20px"
          style={{ borderRadius: '7px' }}
        >
          <Flex flexDirection="row" alignItems="center">
            <Image src={BalanceWallet} width="18px" mr={2} />
            <Text color="white">Your balance</Text>
          </Flex>
          <Flex mt="20px">
            <Text color="white" fontSize="18px" fontWeight={500}>
              {`${balance.pretty()} ${symbol}`}
            </Text>
          </Flex>
          <Flex
            bg="#5973e7"
            mt="13px"
            mb="8px"
            ml="-10%"
            style={{ height: '1px', width: '120%' }}
          />
          <Text color="white">{`≈ ${usdBalance.pretty()} USD`}</Text>
        </Flex>
      )}
      <Flex flexDirection="column" py={4} width="90%">
        <Bold pl={4} pb={3} fontSize={0} color="#a6c1ff">
          MENU
        </Bold>
        <Flex flexDirection="column" width="100%" justifyContent="center">
          <Tab
            link={`/community/${address}/detail`}
            imgSrcActive={DetailActiveSrc}
            imgSrcInactive={DetailSrc}
          >
            Detail
          </Tab>
          <Tab
            link={`/community/${address}/governance`}
            imgSrcActive={GovernanceActiveSrc}
            imgSrcInactive={GovernanceSrc}
          >
            Governance
          </Tab>
          <Tab
            link={`/community/${address}/proposal`}
            imgSrcActive={ProposalActiveSrc}
            imgSrcInactive={ProposalSrc}
          >
            Proposal
          </Tab>
          {hasTcd && (
            <Tab
              link={`/community/${address}/provider`}
              imgSrcActive={DataProviderActive}
              imgSrcInactive={DataProviderInactive}
            >
              Data providers
            </Tab>
          )}
        </Flex>
      </Flex>
    </Flex>
  </Left>
)
