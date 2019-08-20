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

import BackgroundCompanySrc from 'images/background-company.png'
import media, { isMobile } from 'ui/media'

const OvalBox = styled(Flex).attrs({
  alignItems: 'center',
  justifyContent: 'center',
})`
  background-color: #f2f2f2;
  border-radius: 50%;
  width: 132px;
  height: 132px;
`

const PositionButton = styled(Button)`
  display: flex;
  justify-content: space-between;
  text-align: left;
  margin-top: 20px;
  font-weight: 600;
  height: 60px;
  width: 100%;

  min-width: 300px;
  background: #e9edff;
  cursor: pointer;
`

const Featured = styled.a.attrs({
  target: '_blank',
})`
  padding: 0 10px 30px;
  display: block;
  transition: all 250ms;

  ${media.mobile} {
  }

  &:hover {
    transform: translateY(-5px);
  }
`

const ApplyButton = styled(Button)`
  width: 135px;
  height: 45px;
  border-radius: 22.5px;
  border: solid 1px #6b8bf5;
  box-shadow: ${props =>
    props.isSelected ? '0 8px 17px 0 rgba(191, 191, 191, 0.5)' : 'none'};
  background-color: ${props => (props.isSelected ? '#6b8bf5' : '#ffffff')};
  color: ${props => (props.isSelected ? 'white' : '#4a4a4a')};
  font-size: 18px;
  font-weight: 300;
  transition: all 0.5s;
  cursor: pointer;
  &:focus {
    outline: none;
  }
`
const JobPositionComponent = ({ title, to }) => {
  return (
    <AbsoluteLink to={to} style={{ width: '100%' }}>
      <PositionButton color="#323232">
        {title}
        <FontAwesomeIcon icon={faChevronRight} />
      </PositionButton>
    </AbsoluteLink>
  )
}

const CultureComponent = ({ title, description }) => {
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
      <OvalBox> 1</OvalBox>
      <Text
        fontSize={['16px', '28px']}
        lineHeight={['24px', '72px']}
        fontWeight="bold"
      >
        {title}
      </Text>
      <Text
        textAlign="center"
        fontSize={['10px', '18px']}
        lineHeight={['12px', '36px']}
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
            backgroundPosition: 'bottom',
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <PageContainer>
            <Flex
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              maxWidth="1180px"
              py="90px"
            >
              <Text
                textAlign="center"
                fontSize={['24px', '60px']}
                lineHeight={['32px', '80px']}
                fontWeight={900}
                color="#3b426b"
              >
                Join Our Team's Mission to Democretize Data
              </Text>

              <Text
                textAlign="center"
                fontSize={['14px', '18px']}
                lineHeight={['20px', '36px']}
                color="#323232"
                mb="28px"
              >
                We are a team of builders who believe in potential of
                decentralized systems. If you're excited about deep tech and
                blockchain technologies, let's have a chat on how we can work
                together.
              </Text>

              <FilledButton
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
          >
            Our Culture
          </Text>
        </Flex>
        <Flex flexDirection="row" flexWrap="wrap" mb="50px">
          <CultureComponent
            title="Decentralization First"
            description="We believe that great products must "
          />
          <CultureComponent
            title="Community Driven"
            description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
                felis eros, ultricies et mi at."
          />
          <CultureComponent
            title="Open Source by Default"
            description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
                felis eros, ultricies et mi at."
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
            <FilledButton message="Apply Now" width="435px" arrow />
          </AbsoluteLink>
        </Flex>
      </Box>
    </Box>
  )
}
