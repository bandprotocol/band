import React, { useRef, useState } from 'react'
import Animator from 'components/Animator'
import styled from 'styled-components/macro'
import PageContainer from 'components/PageContainer'
import FilledButton from 'components/FilledButton'
import ArrowRight from 'components/ArrowRight'
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

import Step1Src from 'images/animate-tcd/step-1.png'
import Step2Src from 'images/animate-tcd/step-2.png'
import Step3Src from 'images/animate-tcd/step-3.png'
import Step4Src from 'images/animate-tcd/step-4.png'
import Step1ActiveSrc from 'images/animate-tcd/step-1-active.png'
import Step2ActiveSrc from 'images/animate-tcd/step-2-active.png'
import Step3ActiveSrc from 'images/animate-tcd/step-3-active.png'
import Step4ActiveSrc from 'images/animate-tcd/step-4-active.png'

import Animate1Src from 'images/animate-tcd/animate-1.png'
import Animate2Src from 'images/animate-tcd/animate-2.png'
import Animate3Src from 'images/animate-tcd/animate-3.png'
import Animate4Src from 'images/animate-tcd/animate-4.png'
import Animate5Src from 'images/animate-tcd/animate-5.png'
import Animate6Src from 'images/animate-tcd/animate-6.png'
import Animate8Src from 'images/animate-tcd/animate-8.png'
import Animate9Src from 'images/animate-tcd/animate-9.png'
import Animate10ASrc from 'images/animate-tcd/animate-10a.png'
import Animate10BSrc from 'images/animate-tcd/animate-10b.png'
import Animate11Src from 'images/animate-tcd/animate-11.png'
import Animate12ASrc from 'images/animate-tcd/animate-12a.png'
import Animate12BSrc from 'images/animate-tcd/animate-12b.png'

const animatorSteps = [
  {
    src: Step1Src,
    srcActive: Step1ActiveSrc,
    header1: 'Community',
    header2: 'creates a TCD',
    renderText: () =>
      'Token Curate DataSources (TCD) is a method for a community to collectively govern and manage data. It is suitable for curating objective information with large amount of data volume such as asset prices, blockchain transactions, and real-world events.',
  },
  {
    src: Step2Src,
    srcActive: Step2ActiveSrc,
    header1: 'Providers stake and',
    header2: 'submit new data point',
    renderText: () =>
      'A token holder can become a data provider by deploying Data Source Contract and feed the data to it. He or she then registers to become a provider candidate by staking tokens that meet the minimum requirement.',
  },
  {
    src: Step3Src,
    srcActive: Step3ActiveSrc,
    header1: 'Collect consumption',
    header2: 'fees in return',
    renderText: () =>
      'Use crypto-fiat and other asset price feed to power decentralized lending, derivative trading, stablecoins, and payment services',
  },
  {
    src: Step4Src,
    srcActive: Step4ActiveSrc,
    header1: 'DApps consume',
    header2: 'data from aggregator',
    renderText: () =>
      'DApps access data via an aggregator function. The return data are synchronous and reliable.',
  },
]

const animatorSpites = [
  {
    src: Animate1Src,
    height: 78,
    steps: [
      [1, 212, 212, 0, 1.8], //
      [1, 302, 212], //
      [1, 347, 212], //
      [1, 136, 212], //
    ],
  },
  {
    src: Animate2Src,
    height: 62,
    steps: [
      [0, 121, 223], //
      [1, 121, 223], //
      [1, 184, 223, 0, 0.9], //
      [1, 0, 223, 0, 0.7], //
    ],
  },
  {
    src: Animate3Src,
    height: 21,
    steps: [
      [0, 160, 244], //
      [1, 187, 244], //
      [1, 240, 244, 0, 0.9], //
      [1, 40, 244, 0, 0.7], //
    ],
  },
  {
    src: Animate4Src,
    height: 22,
    steps: [
      [0, 196, 230], //
      [1, 196, 222, 200], //
      [1, 253, 222], //
      [0, 253, 222], //
    ],
  },
  {
    src: Animate4Src,
    height: 22,
    steps: [
      [0, 218, 230], //
      [1, 218, 222, 400], //
      [1, 277, 222], //
      [0, 277, 222], //
    ],
  },
  {
    src: Animate4Src,
    height: 22,
    steps: [
      [0, 242, 230], //
      [1, 242, 222, 600], //
      [1, 300, 222], //
      [0, 300, 222], //
    ],
  },
  {
    src: Animate5Src,
    height: 145,
    steps: [
      [0, 60, 182], //
      [0, 60, 182], //
      [1, 77, 182], //
      [0, 60, 182], //
    ],
  },
  {
    src: Animate6Src,
    height: 209,
    steps: [
      [0, 0, 146], //
      [0, 0, 146], //
      [0, 0, 146], //
      [1, 29, 146, 300], //
    ],
  },
  {
    src: Animate8Src,
    height: 60,
    steps: [
      [0, 202, 225], //
      [0, 202, 225], //
      [0, 202, 225], //
      [1, 220, 225, 600], //
    ],
  },
  {
    src: Animate9Src,
    width: 34,
    steps: [
      [0, 260, 197], //
      [0, 260, 197], //
      [0, 260, 197], //
      [1, 275, 197, 800], //
    ],
  },
  {
    src: Animate10ASrc,
    width: 55,
    steps: [
      [0, 310, 230], //
      [0, 310, 230], //
      [0, 310, 230], //
      [1, 320, 230, 950], //
    ],
  },
  {
    src: Animate10BSrc,
    width: 25,
    steps: [
      [0, 330, 190], //
      [0, 330, 190], //
      [0, 330, 190], //
      [1, 330, 200, 1100], //
    ],
  },
  {
    src: Animate11Src,
    height: 79,
    steps: [
      [0, 380, 220], //
      [0, 380, 220], //
      [0, 380, 220], //
      [1, 380, 210, 1200], //
    ],
  },
  {
    src: Animate12ASrc,
    width: 55,
    steps: [
      [0, 330, 260], //
      [0, 330, 260], //
      [0, 330, 260], //
      [1, 320, 260, 1400], //
    ],
  },
  {
    src: Animate12BSrc,
    width: 25,
    steps: [
      [0, 340, 270], //
      [0, 340, 270], //
      [0, 340, 270], //
      [1, 340, 280, 1550], //
    ],
  },
]

const TCDContainer = styled(Flex)`
  background: #ffffff;
  box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  max-width: 1200px;
  margin: 0 auto;
  flex-direction: column;
`

const StepButton = styled(Button)`
  margin: 0 20px;
  font-family: bio-sans;
  color: white;
  padding: 6px 24px !important;
  font-weight: 500;
  text-shadow: 0 3px 10px rgba(0, 0, 0, 0.15);
  height: 46px;
  border-radius: 2px;
  box-shadow: 0 5px 20px 0 rgba(0, 0, 0, 0.15);
  cursor: pointer;
  font-family: bio-sans;
  transition: all 0.2s;
  background-image: linear-gradient(180deg, #6179e1 0%, #455ad3 99%);

  &:hover {
    background-image: linear-gradient(180deg, #465cbb 0%, #3346b1 99%);
  }

  &:focus {
    outline: none;
  }

  ${p =>
    p.disabled &&
    `
    pointer-events: none;
    background-image: linear-gradient(180deg, #BCBCBC 2%, #878787 99%);
  `}
`

export default () => {
  const [step, setStep] = useState(0)
  const exRef = useRef(null)
  const _isMobile = isMobile()
  return (
    <Box
      style={{
        background: 'white',
        color: '#323232',
        overflow: 'hidden',
      }}
      mt="-80px"
    >
      {/* Section 1 */}
      <Box pt="60px" bg="f2f2f2">
        <PageContainer>
          <Flex
            pt={['50px', '100px']}
            pb={['50px', '60px']}
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
          >
            <Text
              lineHeight={1.6}
              fletterSpacing="1px"
              fontWeight={600}
              fontSize={['32px', '48px']}
              color="#3b426b"
              textAlign={['center', 'center']}
              mt={['30px', '0px']}
            >
              Visualizing Data Curation via
              <br />
              Token-Curated DataSource
            </Text>
            <Text
              textAlign="center"
              mt="20px"
              style={{ lineHeight: '2', maxWidth: '1000px' }}
            >
              Token-Curated DataSource (TCD) is a standard for community to
              collectively curate data. Similarly to Delegated Proof of Stake
              (dPoS) concensus, Dataset token holders collectively elect data
              providers by staking their token in the name of the candidates.
              TCD is suitable for curating high-volume, easy-to-verify,
              objective information such as price and event outcome.
            </Text>
          </Flex>
        </PageContainer>
      </Box>

      {/* Section 3 */}
      <Box bg="white" mt="10px">
        <PageContainer>
          <TCDContainer>
            <Flex
              flex={1}
              style={{
                backgroundImage:
                  'linear-gradient(180deg, #F6F8FF 0%, #E9ECFF 100%)',
                borderRadius: '8px 8px 0 0',
                position: 'relative',
                overflow: 'hidden',
              }}
              px={3}
            >
              {!_isMobile && (
                <Box
                  style={{
                    background: '#5569DE',
                    position: 'absolute',
                    height: 3,
                    bottom: 0,
                    width: `${100 / animatorSteps.length}%`,
                    left: `${(step * 100) / animatorSteps.length}%`,
                    transition: 'all 200ms',
                  }}
                />
              )}
              {animatorSteps.map(({ header1, header2 }, i) => (
                <Flex
                  flex={['0 0 100%', 1]}
                  alignItems="center"
                  px={3}
                  py={3}
                  onClick={() => setStep(i)}
                  style={{
                    cursor: 'pointer',
                    transform: _isMobile
                      ? `translateX(${
                          i < step ? -100 * (i + 1) : i > step ? 0 : -100 * i
                        }%)`
                      : '',
                    transition: 'all 350ms',
                  }}
                >
                  <Text
                    fontWeight="bold"
                    fontSize={60}
                    mr={3}
                    style={{
                      color: step === i ? '#5569DE' : '#BABDCF',
                      transition: 'all 200ms',
                    }}
                  >
                    {i + 1}
                  </Text>
                  <Text
                    fontWeight="bold"
                    fontSize={18}
                    lineHeight={1.5}
                    fontFamily="bio-sans"
                    style={{
                      color: step === i ? '#3B426B' : '#BABDCF',
                      transition: 'all 200ms',
                    }}
                  >
                    {header1}
                    <br />
                    {header2}
                  </Text>
                </Flex>
              ))}
            </Flex>
            <Flex justifyContent="center">
              <Flex
                style={{
                  position: 'relative',
                  pointerEvents: 'none',
                  transform: `scale(${_isMobile ? '0.65' : '1.35'})`,
                  filter: 'brightness(0.98) saturate(2) contrast(1.03)',
                }}
                justifyContent="center"
                py={3}
                mt={['-150px', '0px']}
              >
                <Animator
                  title="How TCDs work"
                  step={step}
                  steps={animatorSteps}
                  spites={animatorSpites}
                />
              </Flex>
            </Flex>
            <Text
              mt={['-150px', '-80px']}
              px={[4, 5]}
              lineHeight="1.8"
              fontSize={[14, 17]}
              color="#3B426B"
              textAlign="center"
              style={{ minHeight: '3.6em' }}
            >
              {animatorSteps[step].renderText()}
            </Text>
            <Flex py={4} justifyContent="center">
              <StepButton
                onClick={() => setStep(step - 1)}
                disabled={step === 0}
              >
                <Flex alignItems="center">
                  <ArrowRight color="white" reverse />
                  <Text fontSize={['13px', '18px']} ml={[1, 4]}>
                    Previous
                  </Text>
                </Flex>
              </StepButton>

              <StepButton
                onClick={() => setStep(step + 1)}
                disabled={step === animatorSteps.length - 1}
              >
                <Flex alignItems="center">
                  <Text fontSize={['13px', '18px']} mr={[1, 4]}>
                    Next
                  </Text>
                  <ArrowRight color="white" />
                </Flex>
              </StepButton>
            </Flex>
          </TCDContainer>

          <Flex justifyContent="center" my="50px">
            <FilledButton
              message="Next: Participating in Data Curation "
              arrow
              width={_isMobile ? 'auto' : '520px'}
              to="/features/data-governance-portal"
            />
          </Flex>
        </PageContainer>
      </Box>
    </Box>
  )
}
