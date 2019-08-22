import React, { useState } from 'react'
import styled from 'styled-components/macro'
import PageContainer from 'components/PageContainer'
import FilledButton from 'components/FilledButton'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { colors } from 'ui'
import {
  Flex,
  Text,
  BackgroundCard,
  H1,
  Button,
  Card,
  Image,
  Box,
  H2,
  H3,
  AbsoluteLink,
  Link,
  Bold,
} from 'ui/common'

import TeamworkSrc from 'images/teamwork.svg'
import OpensourceSrc from 'images/open-source.svg'
import BlockchainSrc from 'images/blockchain.svg'
import BackgroundCompanySrc from 'images/background-company.svg'
import media, { isMobile } from 'ui/media'

const PositionButton = styled(Button)`
  display: flex;
  justify-content: space-between;
  text-align: left;
  margin-top: 20px;
  font-weight: 600;
  height: 60px;
  background: #e9edff;
  cursor: pointer;
`

const JobPositionComponent = ({ title, to }) => {
  return (
    <AbsoluteLink to={to}>
      <PositionButton width={['300px', '900px']} color="#323232">
        <Text fontWeight={600} fontFamily="bio-sans">
          {title}
        </Text>

        <FontAwesomeIcon icon={faChevronRight} />
      </PositionButton>
    </AbsoluteLink>
  )
}

const CultureComponent = ({ title, description, imgSrc }) => {
  return (
    <Flex
      flex="1"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      px="20px"
      mx="20px"
      my="20px"
      style={{ maxWidth: '400px', minWidth: '300px' }}
    >
      <Box>
        <Image src={imgSrc} />
      </Box>
      <Text
        fontFamily="bio-sans"
        textAlign="center"
        fontSize={['16px', '28px']}
        lineHeight={['24px', '72px']}
        fontWeight="bold"
      >
        {title}
      </Text>
      <Text
        textAlign="center"
        fontSize={['10px', '18px']}
        lineHeight={['20px', '36px']}
        color="#323232"
      >
        {description}
      </Text>
    </Flex>
  )
}

export default () => {
  const _isMobile = isMobile()
  return (
    <Box style={{ overflow: 'hidden' }}>
      <Box
        style={{
          backgroundImage: 'linear-gradient(to bottom, #f0f4ff, #e7edff)',
        }}
      >
        <Box
          style={{
            backgroundImage: `url(${BackgroundCompanySrc})`,
            backgroundPosition: 'center 108%',
            backgroundSize: '1400px',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <PageContainer>
            <Flex
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              maxWidth="1380px"
              py="90px"
            >
              <Text
                textAlign="center"
                fontFamily="bio-sans"
                fontSize={['24px', '60px']}
                lineHeight={['32px', '80px']}
                fontWeight={900}
                color="#3b426b"
                style={{ maxWidth: 900 }}
              >
                Join Our Team's Mission to Democretize Data
              </Text>

              <Text
                textAlign="center"
                fontSize={['14px', '18px']}
                lineHeight={['20px', '36px']}
                color="#323232"
                mb="32px"
                mt={20}
                style={{ maxWidth: 640 }}
              >
                We are a team of builders who believe in potential of
                decentralized systems. If you're excited about deep tech and
                blockchain technologies, let's have a chat on how we can work
                together.
              </Text>

              <FilledButton
                href="mailto:connect@bandprotocol.com"
                message="Connect with Our Team"
                arrow
                width="348px"
                style={{
                  backgroundImage:
                    'linear-gradient(to bottom, #2a3a7f, #1c2764)',
                }}
              />
            </Flex>
          </PageContainer>
        </Box>
      </Box>

      <Flex
        mt={['30px', '84px']}
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <Flex justifyContent="center" mb={['10px', '40px']}>
          <Text
            color="#3b426b"
            lineHeight={[1, 1.67]}
            fontSize={['24px', '48px']}
            fontWeight="bold"
            fontFamily="bio-sans"
          >
            Our Culture
          </Text>
        </Flex>
        <Flex
          flexDirection="row"
          alignItems="baseline"
          flexWrap="wrap"
          mb="50px"
        >
          <CultureComponent
            title="Decentralization"
            description=""
            imgSrc={BlockchainSrc}
          />
          <CultureComponent
            title="Community Driven"
            description=""
            imgSrc={TeamworkSrc}
          />
          <CultureComponent
            title="Open Source"
            description=""
            imgSrc={OpensourceSrc}
          />
        </Flex>
      </Flex>
      <PageContainer>
        <Flex
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
        >
          <Text
            fontSize={['24px', '48px']}
            fontWeight="bold"
            lineHeight="80px"
            color="#3b426b"
            fontFamily="bio-sans"
          >
            Open Positions
          </Text>
          <JobPositionComponent
            title="Tech Lead - Web Development"
            to="https://angel.co/company/bandprotocol/jobs/559811-tech-lead-web-development"
          />
          <JobPositionComponent
            title="Software Engineer - Front End"
            to="https://angel.co/company/bandprotocol/jobs/559815-software-engineer-front-end"
          />
          <JobPositionComponent
            title="Senior UX/UI Designer"
            to="https://angel.co/company/bandprotocol/jobs/559812-senior-ui-ux-designer"
          />
        </Flex>
      </PageContainer>
      <Box mt="60px" pb="60px" px="20px">
        <Flex justifyContent="center">
          <AbsoluteLink to="https://angel.co/company/bandprotocol/jobs/">
            <FilledButton
              message="Apply Now"
              width={['300px', '435px']}
              arrow
            />
          </AbsoluteLink>
        </Flex>
      </Box>
    </Box>
  )
}
