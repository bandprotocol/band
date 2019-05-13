import React from 'react'
import styled from 'styled-components/macro'
import PageContainer from 'components/PageContainer'
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

import Animator from 'components/Animator'

import StartBuilding from 'components/StartBuilding'
import CoinHatcherShowcase from 'components/CoinHatcherShowcase'

import TCRSrc from 'images/tcr.png'
import TCRWorkSrc from 'images/tcr-work.png'
import TCRWorkVertSrc from 'images/tcr-work-vert.png'

import SSExample1 from 'images/chtssLeft.png'
import SSExample2 from 'images/chtssMid.png'
import SSExample3 from 'images/chtssRight.png'

import Step1Src from 'images/animate-tcr/step-1.png'
import Step2Src from 'images/animate-tcr/step-2.png'
import Step3Src from 'images/animate-tcr/step-3.png'
import Step4Src from 'images/animate-tcr/step-4.png'
import Step1ActiveSrc from 'images/animate-tcr/step-1-active.png'
import Step2ActiveSrc from 'images/animate-tcr/step-2-active.png'
import Step3ActiveSrc from 'images/animate-tcr/step-3-active.png'
import Step4ActiveSrc from 'images/animate-tcr/step-4-active.png'

import Animate1Src from 'images/animate-tcr/animate-1.png'
import Animate2Src from 'images/animate-tcr/animate-2.png'
import Animate3Src from 'images/animate-tcr/animate-3.png'
import Animate4Src from 'images/animate-tcr/animate-4.png'
import Animate5Src from 'images/animate-tcr/animate-5.png'
import Animate6Src from 'images/animate-tcr/animate-6.png'
import Animate7Src from 'images/animate-tcr/animate-7.png'
import Animate8Src from 'images/animate-tcr/animate-8.png'
import Animate9Src from 'images/animate-tcr/animate-9.png'
import Animate10Src from 'images/animate-tcr/animate-10.png'
import Animate11Src from 'images/animate-tcr/animate-11.png'

const animatorSteps = [
  {
    src: Step1Src,
    srcActive: Step1ActiveSrc,
    renderText: () =>
      'Token-Curated Registry (TCR) is a method for a community to collectively curate a list of data directly. The eligibility of data is governed by a community-defined curation guideline.',
  },
  {
    src: Step2Src,
    srcActive: Step2ActiveSrc,
    renderText: () =>
      'When an applicant wish to include his or her data in the list, he or she needs to propose the data to the TCR while staking tokens.',
  },
  {
    src: Step3Src,
    srcActive: Step3ActiveSrc,
    renderText: () =>
      "To uphold quality of the contents, token holders challenge low-quality data which open a community-wide voting. If the challenger wins, he or she takes a portion of the applicant's stake and vice versa.",
  },
  {
    src: Step4Src,
    srcActive: Step4ActiveSrc,
    renderText: () =>
      'Data in TCRs are publicly available. The more users trust the data, the higher demands for applicant to add more data to the list. ',
  },
]

const animatorSpites = [
  {
    src: Animate1Src,
    height: 110,
    steps: [
      [1, 198, 195, 0, 1.4], //
      [1, 287, 195], //
      [1, 334, 195], //
      [1, 80, 200, 0, 1.3], //
    ],
    style: { zIndex: 1 },
  },
  {
    src: Animate2Src,
    height: 167,
    steps: [
      [0, 110, 161], //
      [1, 122, 161, 300], //
      [0, 110, 161], //
      [0, 110, 161], //
    ],
  },
  {
    src: Animate3Src,
    height: 151,
    steps: [
      [0, 150, 167], //
      [1, 160, 167, 600], //
      [1, 54, 167], //
      [0, 54, 167], //
    ],
  },
  {
    src: Animate4Src,
    height: 167,
    steps: [
      [0, 181, 150], //
      [1, 181, 161, 800], //
      [1, 56, 161], //
      [0, 56, 161], //
    ],
  },
  {
    src: Animate5Src,
    height: 150,
    steps: [
      [0, 180, 130], //
      [1, 180, 141, 800], //
      [0, 180, 130], //
      [0, 180, 130], //
    ],
  },
  {
    src: Animate6Src,
    height: 237,
    steps: [
      [0, 179, 114], //
      [0, 179, 114], //
      [1, 159, 114, 300], //
      [0, 179, 114], //
    ],
  },
  {
    src: Animate7Src,
    height: 29,
    steps: [
      [0, 244, 165], //
      [0, 244, 165], //
      [1, 244, 172, 700], //
      [0, 244, 165], //
    ],
  },
  {
    src: Animate8Src,
    height: 29,
    steps: [
      [0, 244, 232], //
      [0, 244, 232], //
      [1, 244, 239, 1000], //
      [0, 244, 232], //
    ],
  },
  {
    src: Animate7Src,
    height: 29,
    steps: [
      [0, 244, 299], //
      [0, 244, 299], //
      [1, 244, 306, 1300], //
      [0, 244, 299], //
    ],
  },
  {
    src: Animate9Src,
    height: 137,
    steps: [
      [0, 275, 184], //
      [0, 275, 184], //
      [1, 282, 184, 1600], //
      [0, 275, 184], //
    ],
  },
  {
    src: Animate10Src,
    height: 148,
    steps: [
      [0, 220, 170], //
      [0, 220, 170], //
      [0, 220, 170], //
      [1, 230, 170, 300], //
    ],
  },
  {
    src: Animate11Src,
    height: 137,
    steps: [
      [0, 355, 185], //
      [0, 355, 185], //
      [0, 355, 185], //
      [1, 363, 185, 600], //
    ],
  },
]

export default () => {
  const _isMobile = isMobile()
  return (
    <Box>
      <PageContainer>
        <Flex flexDirection="column" alignItems="center" mb={4}>
          <Box
            mt={['30px', '60px']}
            mb={2}
            width={['calc(100vw - 40px)', 'auto']}
          >
            <Text
              fontSize={['24px', '38px']}
              textAlign={['left', 'center']}
              color="#2a304e"
              fontWeight={900}
            >
              Token-Curated Registry
            </Text>
          </Box>
          <Flex mt={['15px', '15px']} width={['calc(100vw - 40px)', 'auto']}>
            <Text
              textAlign={['left', 'center']}
              width={['auto', '860px']}
              fontSize={['16px', '18px']}
              lineHeight={[1.63, 1.94]}
            >
              Centralized data providers are susceptible to corruption and
              malicious behavior without appropriate checks and balances.
              Token-Curated Registry enables decentralized, reliable and more
              transparent way to crowd-source information.
            </Text>
          </Flex>
          <Image
            src={TCRSrc}
            my={[4, 5]}
            width={['calc(100vw - 40px)', '800px']}
          />
          <Card
            bg="#f6f8ff"
            pt={4}
            pb={['30px', 5]}
            px="42px"
            width={['calc(100vw - 40px)', '780px']}
          >
            <Text
              textAlign={['left', 'center']}
              fontSize={['16px', '18px']}
              lineHeight={1.94}
              mb={4}
            >
              Token-Curated Registry provide a more reliable and transparent
              data organization mechanism. Anyone can directly submit data by
              staking tokens behind each data point. Token holders are
              incentivized to verify and maintain good dataset as the quality of
              the date relates directly to the value of their token holding
              <br />
              <br />
              Band combines various data sources in order to ensure that
              particular registries can provide meaningful data quickly and
              reliably for users at any time. As the Band ecosystem grows with
              more data overtime, the registries continue to become more
              expansive with a larger volume of data in the feed for anyone to
              utilize with ease.
            </Text>
            <Flex
              justifyContent="center"
              flexDirection={['column-reverse', 'row']}
            >
              <AbsoluteLink href="https://developer.bandprotocol.com/docs/tcr.html">
                <Button
                  variant="primary"
                  style={{
                    height: '45px',
                    width: _isMobile ? '196px' : null,
                    padding: _isMobile ? '5px' : null,
                  }}
                  css={{
                    '&:focus': {
                      outline: 'none',
                    },
                    '&:active': {
                      backgroundColor: '#5269ff',
                    },
                  }}
                >
                  Developer Reference
                </Button>
              </AbsoluteLink>
            </Flex>
          </Card>
        </Flex>

        {isMobile() ? (
          <Flex flexDirection="column" alignItems="center" mb={5} mt={5}>
            <Box mb={2}>
              <H1 textAlign="center" dark>
                How TCRs work
              </H1>
            </Box>
            <Image
              src={_isMobile ? TCRWorkVertSrc : TCRWorkSrc}
              width={['50vw', 'auto']}
              my={4}
            />
          </Flex>
        ) : (
          <Flex
            flexDirection="column"
            alignItems="center"
            mb={5}
            mt={['30px', 5]}
            pb="400px"
          >
            <Animator
              title="How TCRs work"
              steps={animatorSteps}
              spites={animatorSpites}
            />
          </Flex>
        )}
      </PageContainer>
      <Box bg="#f6f8ff" mb={['425px', '0px']}>
        <PageContainer>
          <Flex flexDirection="column" alignItems="center" pb={[0, 5]}>
            <Box mt={5} mb={2}>
              <H1 textAlign="center" dark>
                Use Cases
              </H1>
            </Box>
            <Text
              textAlign="center"
              width={['calc(100vw - 40px)', '555px']}
              fontSize={['16px', '18px']}
              lineHeight={[1.63, 1.94]}
            >
              One of the first releases in this sector for Band will be
              Coinhatcher, a community-curated crypto insight platform that
              focuses on providing accurate cryptocurrency price, volume, news
              and research data.
            </Text>
            <Flex justifyContent="center" mt={['35px', 4]}>
              <Button variant="primary">Go to Coinhatcher</Button>
            </Flex>
          </Flex>
          <CoinHatcherShowcase
            Img1={SSExample1}
            Img2={SSExample2}
            Img3={SSExample3}
          />
        </PageContainer>
      </Box>
      {!_isMobile && <Box bg="#f6f8ff" style={{ height: 180 }} />}
      <Box
        mb={['-350px', '-80px']}
        style={{ background: '#17192e', color: '#ffffff' }}
      >
        <StartBuilding
          style={{ transform: `translateY(-${_isMobile ? 60 : 50}%)` }}
        />
      </Box>
    </Box>
  )
}
