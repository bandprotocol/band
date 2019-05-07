import React from 'react'
import styled from 'styled-components'
import PageContainer from 'components/PageContainer'
import LandingStartBuilding from 'images/landing-start-building.png'

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
import { isMobile } from 'ui/media'

const FilledButton = styled(Button)`
  color: white;
  font-size: 16px;
  font-weight: 500;
  text-shadow: 0 3px 10px rgba(0, 0, 0, 0.15);
  width: 196px;
  height: 46px;
  border-radius: 6px;
  box-shadow: 0 5px 20px 0 rgba(0, 0, 0, 0.15);
  background-color: #6b7df5;
  cursor: pointer;

  &:focus {
    outline: none;
  }
`

const OutlineButton = styled(Button)`
  color: #f7f8ff;
  font-size: 16px;
  font-weight: 500;
  background-color: rgba(0, 0, 0, 0);
  width: 182px;
  height: 46px;
  border-radius: 6px;
  border: solid 1px ${props => props.borderColor};
  cursor: pointer;

  &:focus {
    outline: none;
  }
`

export default ({ style = {}, ...props }) => (
  <PageContainer>
    <Flex
      pt="65px"
      pb="35px"
      px="80px"
      mx="-40px"
      style={{
        borderRadius: '10px',
        boxShadow: '0 5px 20px rgba(0, 0, 0, 0.15)',
        background: 'linear-gradient(to left, #6083ff, #8266ff)',
        ...style,
      }}
      {...props}
    >
      <Flex style={{ width: '620px' }} flexDirection="column">
        <Text fontWeight="600" fontSize="32px">
          Want to start building?
        </Text>
        <Flex my="10px" />
        <Text fontSize="20px">
          Integrating your product right away with Band Protocol SDK
        </Text>
        <Flex mt="40px">
          <a
            href="https://developer.bandprotocol.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <OutlineButton
              borderColor="white"
              style={{
                width: '220px',
              }}
            >
              Technical Doc
            </OutlineButton>
          </a>
          <Flex mx="10px" />
          <FilledButton
            style={{
              width: '220px',
              backgroundImage: 'linear-gradient(249deg, #454366, #3a3d5a)',
            }}
          >
            Developer Portal
          </FilledButton>
        </Flex>
      </Flex>
      <Box flex="0 0 266px" ml="auto">
        <Image src={LandingStartBuilding} />
      </Box>
    </Flex>
  </PageContainer>
)
