import React from 'react'
import styled from 'styled-components'
import PageContainer from 'components/PageContainer'
import { colors } from 'ui'
import {
  Flex,
  Text,
  BackgroundCard,
  H1,
  Button,
  Image,
  Box,
  H3,
  H4,
  AbsoluteLink,
  Link,
  Card,
} from 'ui/common'

import CoinHatcherSrc from 'images/coinhatcher.svg'
import ShitcoinSurvivorsSrc from 'images/shitcoin-survivors.png'
import WorkWithUsSrc from 'images/work-with-us.svg'

const BandApp = ({ name, src, link, author, description, children }) => (
  <Card variant="primary" flex={['', '0 0 340px']} p="14px" bg="#fff" m={2}>
    <Flex
      flexDirection={['column-reverse', 'row']}
      alignItems="flex-start"
      pl={[2, 0]}
    >
      <Image
        mt={[0, 1]}
        mb={[2, 0]}
        width={[100, 80]}
        src={src}
        style={{ borderRadius: 4 }}
      />
      <Box flex={1} ml={[0, '20px']}>
        <Flex>
          <Text
            color={colors.purple.dark}
            size={16}
            fontWeight="500"
            lineHeight={2}
          >
            {name}

            {link && (
              <AbsoluteLink
                href={link}
                style={{ marginLeft: 10, fontSize: '0.9em' }}
                dark
              >
                <i class="fas fa-external-link-alt" />
              </AbsoluteLink>
            )}
          </Text>
        </Flex>
        <Text fontSize={14} color={colors.text.normal} fontWeight="500">
          By {author}
        </Text>
        <Text lineHeight={1.5} fontSize={12} my={3}>
          {description}
        </Text>
      </Box>
    </Flex>
    {children}
  </Card>
)

export default class CommunityPage extends React.Component {
  render() {
    return (
      <React.Fragment>
        <PageContainer>
          <Flex pt={[3, 4]} flexWrap="wrap">
            <BandApp
              name="CoinHatcher"
              link="https://coinhatcher.com"
              src={CoinHatcherSrc}
              author="Band Protocol"
              description="The Bloomberg of Crypto. Coinhatcher is a decentralized data curation with a mission to provide trusted and reliable…"
            >
              <Flex p={2} justifyContent={['flex-start', 'center']}>
                <Box bg="#eff2ff" p={2} my={1} style={{ borderRadius: '4px' }}>
                  <Text
                    fontSize={'14px'}
                    color="#a2b0ea"
                    style={{ fontStyle: 'italic' }}
                  >
                    Coming soon
                  </Text>
                </Box>
              </Flex>
            </BandApp>
            <BandApp
              name="Shitcoin Survivors"
              link="https://shitcoinsurvivors.com"
              src={ShitcoinSurvivorsSrc}
              author="Band Protocol"
              description="A fast-paced crypto-themed card game to mark the 204 capitulation. Buy their game and earn Survivorcoin from their…"
            >
              <Flex p={2} justifyContent={['flex-start', 'center']}>
                <Box bg="#eff2ff" p={2} my={1} style={{ borderRadius: '4px' }}>
                  <Text
                    fontSize={'14px'}
                    color="#a2b0ea"
                    style={{ fontStyle: 'italic' }}
                  >
                    Coming soon
                  </Text>
                </Box>
              </Flex>
            </BandApp>
            <BandApp
              name="Work with us"
              src={WorkWithUsSrc}
              author="Band Protocol"
              description="A fast-paced crypto-themed card game to mark the 204 capitulation. Buy their game and earn Survivorcoin from their…"
            >
              <Flex p={2} justifyContent={['flex-start', 'center']}>
                <AbsoluteLink href="https://bandprotocol.typeform.com/to/A39Zgd">
                  <Button variant="primary">Apply Now!</Button>
                </AbsoluteLink>
              </Flex>
            </BandApp>
          </Flex>
        </PageContainer>
      </React.Fragment>
    )
  }
}
