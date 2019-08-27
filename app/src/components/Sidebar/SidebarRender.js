import React from 'react'
import styled from 'styled-components'
import {
  Image,
  Flex,
  Text,
  Bold,
  HighlightNavLink,
  Box,
  Button,
} from 'ui/common'
import { getProfileColor } from 'ui/communities'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons'
// import TCDSelector from 'components/TCDSelector'
import CircleLoadingSpinner from 'components/CircleLoadingSpinner'
import MockProfileSrc from 'images/mock-profile.svg'
import BalanceWallet from 'images/balanceWallet.svg'

// Images inactive
import DetailSrc from 'images/detailInactive.svg'
import GovernanceSrc from 'images/govInactive.svg'
import ProposalSrc from 'images/voteInactive.svg'

// Image active
import DetailActiveSrc from 'images/detailActive.svg'
import GovernanceActiveSrc from 'images/govActive.svg'
import ProposalActiveSrc from 'images/voteActive.svg'

import DataLogInactive from 'images/dataLogInactive.svg'
import DataSetInactive from 'images/datasetInactive.svg'
import IntegrationInactive from 'images/integrationInactive.svg'

const Left = styled.div`
  align-self: stretch;
  height: auto;
  padding: 60px 0;
  min-height: 100%;
  z-index: 4;
  width: 220px;
  flex: 0 0 220px;
  display: flex;
  flex-direction: column;
  background-image: linear-gradient(to right, #547bff, #5f6aec);
  box-shadow: 1px 0 2px 0 rgba(0, 0, 0, 0.05);
`

const Tab = ({ link, imgSrcActive, imgSrcInactive, children, handleClick }) =>
  link ? (
    <HighlightNavLink to={link} activeClassName="is-active">
      <Flex py={1} px={3} style={{ height: 52 }}>
        <Flex
          flex={1}
          flexDirection="row"
          alignItems="center"
          className="tab"
          pl={4}
        >
          <Image
            className="img-active"
            src={imgSrcActive}
            width="20px"
            height="20px"
          />
          <Image
            className="img-inactive"
            src={imgSrcInactive}
            width="20px"
            height="20px"
          />
          <Text px={3}>{children}</Text>
        </Flex>
      </Flex>
    </HighlightNavLink>
  ) : (
    <IntegrationButton onClick={handleClick}>
      <Flex py={1} px={3} style={{ height: 52 }}>
        <Flex
          flex={1}
          flexDirection="row"
          alignItems="center"
          className="tab"
          pl={4}
        >
          <Image
            className="img-active"
            src={imgSrcActive}
            width="20px"
            height="20px"
          />
          <Text px={3}>{children}</Text>
        </Flex>
      </Flex>
    </IntegrationButton>
  )

const IntegrationButton = styled(Flex)`
  color: #ffffff;
  text-decoration: none;
  font-size: 14px;

  & .tab {
    color: #ffffff;
    border-radius: 24px;
  }

  &:hover {
    cursor: pointer;
    :not(.is-active) {
      & .tab {
        background-image: linear-gradient(
          257deg,
          rgba(255, 255, 255, 0.1),
          rgba(255, 255, 255, 0.2) 100%
        );
      }
    }
  }
`

export default ({
  logedin,
  name,
  integrationURL,
  src,
  balance,
  lockBalance,
  usdBalance,
  symbol,
  address,
  tcds,
}) => {
  return (
    <Left>
      <Flex flexDirection="column" alignItems="center" py={3}>
        <Flex flexDirection="column" alignItems="center" flex="0 0 auto">
          <Flex
            width="80px"
            justifyContent="center"
            alignItems="center"
            m={3}
            style={{
              height: '80px',
              borderRadius: '50%',
              backgroundImage: getProfileColor(symbol),
              boxShadow: '0 5px 20px 0 rgba(0, 0, 0, 0.2)',
              overflow: 'hidden',
            }}
          >
            <Box
              style={{
                width: '100%',
                height: '100%',
                backgroundImage: `url(${src || MockProfileSrc})`,
                backgroundSize: '85%',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
              }}
            />
          </Flex>
          <Flex mb="20px">
            <Text
              py={1}
              fontSize="18px"
              fontWeight={700}
              color="white"
              textAlign="center"
            >
              {name}
            </Text>
          </Flex>
        </Flex>
        <Flex
          width={[1]}
          flex={1}
          flexDirection="column"
          alignItems="center"
          pt={2}
          pb={4}
          style={{ minHeight: 0 }}
        >
          {!logedin ? null : balance === undefined ? (
            <CircleLoadingSpinner radius="25px" color="white" />
          ) : (
            <Flex
              width="90%"
              flexDirection="column"
              justifyContent="center"
              px="18px"
              py="12px"
              mb={3}
              style={{
                borderRadius: '7px',
                background:
                  'linear-gradient(to top, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.16))',
              }}
            >
              <Flex flexDirection="row" alignItems="center">
                <Image src={BalanceWallet} width="18px" mr={2} mb={1} />
                <Text fontSize="12px" lineHeight="20px" color="white">
                  YOUR BALANCE
                </Text>
              </Flex>
              <Flex mt="20px">
                <Text color="white" fontSize="18px" fontWeight={500}>
                  {`${balance.pretty()} ${symbol}`}
                </Text>
              </Flex>
              <Flex mt="10px">
                <Text color="white" fontSize="14px" fontWeight={500}>
                  {`Locked: ${lockBalance.pretty()} ${symbol}`}
                </Text>
              </Flex>
              <Flex
                bg="#5973e7"
                mt="13px"
                mb="8px"
                ml="-10%"
                style={{ height: '1px', width: '120%' }}
              />
              <Text
                fontSize="12px"
                color="white"
              >{`≈ ${usdBalance.pretty()} USD`}</Text>
            </Flex>
          )}
          <Flex flexDirection="column" width="100%" justifyContent="center">
            <Tab
              link={`/community/${address}/overview`}
              imgSrcActive={DetailActiveSrc}
              imgSrcInactive={DetailSrc}
            >
              Overview
            </Tab>
            <Bold pl="44px" pt={3} pb={3} fontSize="12px" color="#a6c1ff">
              AVAILABLE DATA
            </Bold>

            <Tab
              link={`/community/${address}/dataset`}
              imgSrcActive={DataSetInactive}
              imgSrcInactive={DataSetInactive}
            >
              Explore Data
            </Tab>

            <Tab
              link={`/community/${address}/governance`}
              imgSrcActive={GovernanceSrc}
              imgSrcInactive={GovernanceSrc}
            >
              Governance
            </Tab>
            <Tab
              link={`/community/${address}/logs`}
              imgSrcActive={DataLogInactive}
              imgSrcInactive={DataLogInactive}
            >
              Activity Logs
            </Tab>

            <Tab
              imgSrcActive={IntegrationInactive}
              imgSrcInactive={IntegrationInactive}
              handleClick={() => window.open(integrationURL, '_blank')}
            >
              Integration
              <FontAwesomeIcon
                style={{ marginLeft: '10px' }}
                icon={faExternalLinkAlt}
              ></FontAwesomeIcon>
            </Tab>
            <Bold pl="44px" pt={4} pb={3} fontSize="12px" color="#a6c1ff">
              CONFIGURATIONS
            </Bold>
            <Tab
              link={`/community/${address}/parameters`}
              imgSrcActive={GovernanceActiveSrc}
              imgSrcInactive={GovernanceSrc}
              disabled
            >
              Parameters
            </Tab>
            <Tab
              link={`/community/${address}/proposal`}
              imgSrcActive={ProposalActiveSrc}
              imgSrcInactive={ProposalSrc}
            >
              Proposals
            </Tab>
          </Flex>
        </Flex>
      </Flex>
    </Left>
  )
}
