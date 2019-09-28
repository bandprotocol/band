import React, { useState, useRef, useEffect } from 'react'
import PageContainer from 'components/PageContainer'
import LinkWithArrow from 'components/LinkWithArrow'
import Subscribe from 'components/Subscribe'
import { Flex, Text, Highlight, Image, Box, AbsoluteLink } from 'ui/common'
import { isMobile, isSmallMobile } from 'ui/media'
import FilledButton from 'components/FilledButton'
import WppButton, { OutlineButton } from 'components/WppButton'
import Countdown from 'components/Countdown'
import Snow from 'components/Snow'
import Pyro from 'components/Pyro.js'
import FlexHover from 'components/FlexHover'
import A from 'components/A'

import AngleArrow from 'images/angle-arrow-down.png'
import LandingHero from 'images/landing-hero-background.svg'
import LandingRealworld from 'images/landing-connect-realworld.svg'
import LandingOpenAPI from 'images/landing-connect-openapi.svg'
import LandingMassAdoption from 'images/landing-massadoption.svg'
import LandingFeature from 'images/landing-features.png'

import Reddit from 'images/reddit.svg'
import Telegram from 'images/telegram.svg'
import Medium from 'images/medium.svg'
import Twitter from 'images/twitter.svg'
import Github from 'images/githubWhite.svg'
import RightHexs from 'images/rightHexs.png'
import LeftHexs from 'images/leftHexs.png'
import HexBottom from 'images/hexBottom.png'
import Planet from 'images/planet.svg'
import Plant from 'images/plant.svg'
import BSLogo from 'images/bitswinglogo.svg'
import BandLogo from 'images/logoSmall.png'
import MLogo from 'images/mediumLogo.svg'

const CircleLink = () => (
  <Flex
    width="40px"
    bg="#3b426b"
    justifyContent="center"
    alignItems="center"
    style={{
      height: '40px',
      borderRadius: '50%',
    }}
  >
    <Image
      src={AngleArrow}
      width="15px"
      height="15px"
      css={{ filter: 'invert(100%)' }}
    />
  </Flex>
)

export default () => {
  const exRef = useRef(null)
  const _isMobile = isMobile()
  const _isSmallMobile = isSmallMobile()
  const extraHeigt = window.innerHeight - 40
  const [mainnet, setMainnet] = useState(false)
  const mainnetBeginAt = Math.ceil(Date.now() / 1000) + 5 // 1569844800

  window.setMainnet = setMainnet

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (Math.ceil(Date.now() / 1000) > mainnetBeginAt) {
        setMainnet(true)
      }
    }, 1000)
    return () => clearInterval(intervalId)
  }, [])

  return (
    <>
      {!mainnet && (
        <Flex
          mt="-60px"
          style={{
            overflow: 'hidden',
            height: '100vh',
          }}
        >
          <Snow />
          <Flex
            flexDirection="column"
            justifyContent="center"
            style={{
              positon: 'relative',
              overflow: 'hidden',
              width: '100%',
              backgroundImage:
                'radial-gradient(circle at 50% -100%, rgb(255, 255, 255), rgb(78, 102, 236) 50%, rgb(13, 20, 63))',
            }}
          >
            <Flex justifyContent="center" alignItems="center">
              <Text fontSize={['21px', '55px']} color="white">
                OFFICIAL MAINNET LAUNCH IN
              </Text>
            </Flex>
            <Flex mt="30px">
              <Countdown eventTime={mainnetBeginAt} />
            </Flex>
            <Flex my="70px" justifyContent="center">
              <OutlineButton
                onClick={() => window.scroll(0, window.innerHeight)}
                style={{ zIndex: 1, cursor: 'pointer' }}
              >
                Continue
              </OutlineButton>
            </Flex>

            {/* Hex background */}

            {isMobile() ? (
              <>
                <Flex
                  flexDirection="row"
                  style={{
                    position: 'absolute',
                    bottom: '120px',
                    left: '0px',
                    width: '50%',
                    overflow: 'hidden',
                  }}
                >
                  <Box>
                    <Image src={LeftHexs} />
                  </Box>
                </Flex>

                <Flex
                  flexDirection="row"
                  style={{
                    position: 'absolute',
                    bottom: '50px',
                    right: '0px',
                    width: '75%',
                    overflow: 'hidden',
                  }}
                >
                  <Box>
                    <Image src={RightHexs} />
                  </Box>
                </Flex>
              </>
            ) : (
              <>
                <Flex
                  flexDirection="row"
                  style={{
                    position: 'absolute',
                    bottom: '200px',
                    left: '-20px',
                    width: '40%',
                    overflow: 'hidden',
                  }}
                >
                  <Image src={LeftHexs} />
                </Flex>

                <Flex
                  flexDirection="row"
                  style={{
                    position: 'absolute',
                    bottom: '-50px',
                    right: '0px',
                    width: '75%',
                    overflow: 'hidden',
                  }}
                >
                  <Image src={RightHexs} />
                </Flex>
              </>
            )}
          </Flex>
        </Flex>
      )}
      {mainnet && (
        <Flex
          mt="-60px"
          style={{
            overflow: 'hidden',
            height: '100vh',
            fontFamily: 'bio-sans',
          }}
        >
          <Pyro />
          <Flex
            flexDirection="column"
            justifyContent="center"
            style={{
              positon: 'relative',
              overflow: 'hidden',
              width: '100%',
              backgroundImage: 'linear-gradient(to bottom, #6376b7, #587bf7)',
            }}
          >
            <Flex style={{ position: 'absolute', top: '60px', left: '100px' }}>
              <Image src={Planet} style={{ opacity: 1 }} />
            </Flex>
            <Flex
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              width="100%"
              style={{
                position: 'absolute',
                top: '0%',
                height: isMobile() ? '30%' : '50%',
              }}
            >
              <Text
                fontSize={['40px', '96px']}
                color="white"
                fontFamily="bio-sans"
                fontWeight={700}
                style={{ zIndex: 1 }}
              >
                BAND PROTOCOL
              </Text>
              <Text
                mt="20px"
                fontFamily="bio-sans"
                fontSize={['21px', '40px']}
                color="white"
                textAlign="center"
                style={{ zIndex: 1 }}
              >
                OFFICIAL ETHEREUM MAINNET LAUNCH
              </Text>
            </Flex>

            {/* Hex background */}

            {isMobile() ? (
              <Flex
                mt="80px"
                style={{
                  width: '100%',
                }}
              >
                <Flex width="100%" justifyContent="center">
                  <Flex
                    flexDirection="column"
                    py="20px"
                    px="20px"
                    style={{
                      fontSize: '16px',
                      width: '90%',
                      borderRadius: '8px',
                      boxShadow: '0 50px 100px 0 rgba(0, 0, 0, 0.5)',
                      backgroundImage:
                        'linear-gradient(to bottom, rgba(55, 81, 171, 0.8), rgba(2, 7, 41, 0.8))',
                      zIndex: 1,
                    }}
                  >
                    <Flex
                      alignItems="center"
                      justifyContent="center"
                      flex={1}
                      flexDirection="column"
                      pb="20px"
                      style={{
                        borderBottom: '2px solid rgba(255,255,255,0.5)',
                      }}
                    >
                      <Flex
                        alignItems="center"
                        justifyContent="center"
                        flexDirection="row"
                        width="100%"
                        style={{ maxHeight: '60px', minHeight: '60px' }}
                      >
                        <Text mr="20px" color="white">
                          What is Mainnet
                        </Text>
                        <Image src={BandLogo} style={{ maxHeight: '40px' }} />
                      </Flex>
                      <A href="https://medium.com/bandprotocol" target="_blank">
                        <FlexHover
                          justifyContent="center"
                          alignItems="center"
                          boxShadow="0 8px 16px 0 #020729"
                          boxShadowHover="0 8px 16px 0 #4e5799"
                          bgImg="linear-gradient(52deg, #8a8a8a, #ffffff)"
                          bgImgHover="linear-gradient(52deg, #dddddd, #ffffff)"
                          style={{
                            cursor: 'pointer',
                            width: '188px',
                            height: '40px',
                            borderRadius: '24px',
                          }}
                        >
                          <Text mr="10px" color="#4a4a4a" fontSize="16px">
                            Read more
                          </Text>
                          <Image src={MLogo} width="30px" />
                        </FlexHover>
                      </A>
                    </Flex>
                    <Flex
                      alignItems="center"
                      justifyContent="center"
                      flex={1}
                      flexDirection="column"
                      pb="20px"
                      style={{
                        borderBottom: '2px solid rgba(255,255,255,0.5)',
                      }}
                    >
                      <Flex
                        alignItems="center"
                        justifyContent="center"
                        flexDirection="row"
                        width="100%"
                        style={{ maxHeight: '60px', minHeight: '60px' }}
                      >
                        <Text mr="20px" color="white">
                          Stake Token
                        </Text>
                        <Flex pb="20px">
                          <Image src={Plant} style={{ maxHeight: '40px' }} />
                        </Flex>
                      </Flex>
                      <A href="https://app.bandprotocol.com/" target="_blank">
                        <FlexHover
                          justifyContent="center"
                          alignItems="center"
                          boxShadow="0 8px 16px 0 #68356e"
                          boxShadowHover="0 8px 16px 0 #8c4a94"
                          bgImg="linear-gradient(52deg, #9e32ab, #ffb45b)"
                          bgImgHover="linear-gradient(52deg, #d155e0, #ffc075)"
                          style={{
                            cursor: 'pointer',
                            width: '202px',
                            height: '40px',
                            borderRadius: '27.5px',
                          }}
                        >
                          <Text color="white" fontSize="16px">
                            Governance Portal
                          </Text>
                        </FlexHover>
                      </A>
                    </Flex>
                    <Flex
                      alignItems="center"
                      justifyContent="center"
                      flex={1}
                      pb="20px"
                      flexDirection="column"
                    >
                      <Flex
                        alignItems="center"
                        justifyContent="center"
                        flexDirection="row"
                        width="100%"
                        style={{ maxHeight: '60px', minHeight: '60px' }}
                      >
                        <Text mr="20px" color="white">
                          Play Bitswing
                        </Text>
                        <Image src={BSLogo} style={{ maxHeight: '40px' }} />
                      </Flex>
                      <A href="https://bitswing.io/" target="_blank">
                        <FlexHover
                          justifyContent="center"
                          alignItems="center"
                          boxShadow="0 8px 16px 0 #71114c"
                          boxShadowHover="0 8px 16px 0 #c92e8e"
                          bgImg="linear-gradient(52deg, #36ffe5, #ff0077)"
                          bgImgHover="linear-gradient(52deg, #00ffde, #ff52a3)"
                          style={{
                            cursor: 'pointer',
                            width: '202px',
                            height: '40px',
                            borderRadius: '27.5px',
                          }}
                        >
                          <Text color="white" fontSize="16px">
                            Bitswing
                          </Text>
                        </FlexHover>
                      </A>
                    </Flex>
                  </Flex>
                </Flex>
                <Flex
                  flexDirection="row"
                  style={{
                    position: 'absolute',
                    bottom: '0px',
                    right: '0px',
                    width: '100vw',
                    overflow: 'hidden',
                  }}
                >
                  <Image src={HexBottom} style={{ minWidth: '100vw' }} />
                </Flex>
              </Flex>
            ) : (
              <Flex
                style={{
                  position: 'absolute',
                  top: '50%',
                  width: '100%',
                  height: '50%',
                }}
              >
                <Flex width="100%" justifyContent="center">
                  <Flex
                    flexDirection="row"
                    py="30px"
                    style={{
                      fontSize: '24px',
                      width: '90%',
                      minWidth: '760px',
                      height: '230px',
                      borderRadius: '8px',
                      boxShadow: '0 50px 100px 0 rgba(0, 0, 0, 0.5)',
                      backgroundImage:
                        'linear-gradient(to bottom, rgba(55, 81, 171, 0.8), rgba(2, 7, 41, 0.8))',
                      zIndex: 1,
                    }}
                  >
                    <Flex
                      alignItems="center"
                      flex={1}
                      flexDirection="column"
                      style={{
                        borderRight: '2px solid rgba(255,255,255,0.5)',
                      }}
                    >
                      <Flex
                        alignItems="center"
                        justifyContent="center"
                        flexDirection="row"
                        width="100%"
                        style={{ maxHeight: '60px', minHeight: '60px' }}
                      >
                        <Text mr="20px" color="white">
                          What is Mainnet
                        </Text>
                        <Image src={BandLogo} style={{ maxHeight: '40px' }} />
                      </Flex>
                      <A href="https://medium.com/bandprotocol" target="_blank">
                        <FlexHover
                          mt="30px"
                          justifyContent="center"
                          alignItems="center"
                          boxShadow="0 8px 16px 0 #020729"
                          boxShadowHover="0 8px 16px 0 #4e5799"
                          bgImg="linear-gradient(52deg, #8a8a8a, #ffffff)"
                          bgImgHover="linear-gradient(52deg, #dddddd, #ffffff)"
                          style={{
                            cursor: 'pointer',
                            width: '188px',
                            height: '48px',
                            borderRadius: '24px',
                          }}
                        >
                          <Text mr="10px" color="#4a4a4a" fontSize="18px">
                            Read more
                          </Text>
                          <Image src={MLogo} width="30px" />
                        </FlexHover>
                      </A>
                    </Flex>
                    <Flex
                      alignItems="center"
                      flex={1}
                      flexDirection="column"
                      style={{
                        borderRight: '2px solid rgba(255,255,255,0.5)',
                      }}
                    >
                      <Flex
                        alignItems="center"
                        justifyContent="center"
                        flexDirection="row"
                        width="100%"
                        style={{ maxHeight: '60px', minHeight: '60px' }}
                      >
                        <Text mr="20px" color="white">
                          Stake Token
                        </Text>
                        <Flex pb="20px">
                          <Image src={Plant} style={{ maxHeight: '40px' }} />
                        </Flex>
                      </Flex>
                      <A href="https://app.bandprotocol.com/" target="_blank">
                        <FlexHover
                          mt="30px"
                          justifyContent="center"
                          alignItems="center"
                          boxShadow="0 8px 16px 0 #68356e"
                          boxShadowHover="0 8px 16px 0 #8c4a94"
                          bgImg="linear-gradient(52deg, #9e32ab, #ffb45b)"
                          bgImgHover="linear-gradient(52deg, #d155e0, #ffc075)"
                          style={{
                            cursor: 'pointer',
                            width: '202px',
                            height: '48px',
                            borderRadius: '27.5px',
                          }}
                        >
                          <Text color="white" fontSize="18px">
                            Governance Portal
                          </Text>
                        </FlexHover>
                      </A>
                    </Flex>
                    <Flex alignItems="center" flex={1} flexDirection="column">
                      <Flex
                        alignItems="center"
                        justifyContent="center"
                        flexDirection="row"
                        width="100%"
                        style={{ maxHeight: '60px', minHeight: '60px' }}
                      >
                        <Text mr="20px" color="white">
                          Play Bitswing
                        </Text>
                        <Image src={BSLogo} style={{ maxHeight: '40px' }} />
                      </Flex>
                      <A href="https://bitswing.io/" target="_blank">
                        <FlexHover
                          mt="30px"
                          justifyContent="center"
                          alignItems="center"
                          boxShadow="0 8px 16px 0 #71114c"
                          boxShadowHover="0 8px 16px 0 #c92e8e"
                          bgImg="linear-gradient(52deg, #36ffe5, #ff0077)"
                          bgImgHover="linear-gradient(52deg, #00ffde, #ff52a3)"
                          style={{
                            cursor: 'pointer',
                            width: '202px',
                            height: '48px',
                            borderRadius: '27.5px',
                          }}
                        >
                          <Text color="white" fontSize="18px">
                            Bitswing
                          </Text>
                        </FlexHover>
                      </A>
                    </Flex>
                  </Flex>
                </Flex>
                <Flex
                  flexDirection="row"
                  style={{
                    position: 'absolute',
                    bottom: '0px',
                    right: '0px',
                    width: '100vw',
                    overflow: 'hidden',
                  }}
                >
                  <Image src={HexBottom} style={{ minWidth: '100vw' }} />
                </Flex>
              </Flex>
            )}

            <Flex
              width="100%"
              justifyContent="center"
              style={{ bottom: 'calc(10% - 40px)', position: 'absolute' }}
            >
              <OutlineButton
                onClick={() => window.scroll(0, window.innerHeight)}
                style={{ zIndex: 1, cursor: 'pointer' }}
              >
                Continue
              </OutlineButton>
            </Flex>
          </Flex>
        </Flex>
      )}
      <Box
        style={{
          background: 'white',
          color: '#3b426b',
          overflow: 'hidden',
        }}
        mt="-80px"
      >
        {/* Section 1 */}
        <Box
          pt="60px"
          style={{
            backgroundImage: 'linear-gradient(to bottom, #5A7FFD 5%, #354392)',
          }}
        >
          <Box
            style={{
              backgroundImage: `url(${LandingHero})`,
              backgroundPosition: `${_isMobile ? '-890px 340px' : 'bottom'}`,
              backgroundSize: `${_isMobile ? 'cover' : '1700px 550px'}`,
              backgroundRepeat: 'no-repeat',
            }}
          >
            <PageContainer>
              <Flex
                pt={['50px', '150px']}
                pb={['50px', '140px']}
                flexDirection={['column', 'row']}
              >
                {/* {_isMobile && (
                <Flex
                  flex={1}
                  style={{ minWidth: 'calc(100vw - 40px)' }}
                  justifyContent="flex-end"
                  alignItems="center"
                >
                  <Image src={LandingHero} />
                </Flex>
              )} */}
                <Box flex={1}>
                  <Text
                    lineHeight={1.4}
                    fletterSpacing="1px"
                    fontWeight={600}
                    fontSize={['24px', '56px']}
                    color="white"
                    textAlign={['center', 'left']}
                    mt={['30px', '0px']}
                    fontFamily="bio-sans"
                  >
                    Data Governance Framework
                    <br />
                    for Web 3.0 Applications
                  </Text>
                  <Flex mt="35px" style={{ maxWidth: ['320px', '390px'] }}>
                    <Text
                      color="white"
                      fontSize={['16px', '22px']}
                      lineHeight={1.8}
                      fontWeight={300}
                      textAlign={['center', 'left']}
                    >
                      Band Protocol connects{' '}
                      <span style={{ color: '#BBDEFF' }}>smart contracts</span>{' '}
                      with trusted{' '}
                      <span style={{ color: '#BBDEFF' }}>off-chain</span>
                      {_isMobile ? null : <br />}
                      <span style={{ color: '#BBDEFF' }}>information</span>,
                      provided through community-curated data providers.
                    </Text>
                  </Flex>
                  <Flex
                    mt={['40px', '60px']}
                    alignItems={['center', 'flex-start']}
                    flexDirection={['column', 'row']}
                  >
                    <AbsoluteLink href="https://developer.bandprotocol.com/">
                      <FilledButton
                        message="Developer Documentation"
                        href="https://developer.bandprotocol.com/"
                      />
                    </AbsoluteLink>
                    <Flex mx={['0px', '10px']} my={['10px', '0px']} />
                    <WppButton />
                  </Flex>
                  {/* Join us */}
                  <Flex
                    mr="60px"
                    mt="50px"
                    width={1}
                    flexDirection={['column', 'row']}
                    alignItems="center"
                  >
                    <Box
                      width="67px"
                      bg="white"
                      mx="15px"
                      style={{ height: '1px' }}
                    />
                    <Text
                      fontSize="18px"
                      fontWeight={500}
                      color="white"
                      mr={['0px', '30px']}
                      mb={['20px', '0px']}
                      mt={['30px', '0px']}
                      textAlign={['center', 'left']}
                      fontFamily="bio-sans"
                    >
                      Join us {!_isMobile && ':'}
                    </Text>
                    <Flex
                      flex={1}
                      justifyContent={['center', 'left']}
                      alignItems="center"
                    >
                      <AbsoluteLink href="https://t.me/joinchat/E48nA06UIBFmNsE9OaDusQ">
                        <Flex
                          mr="20px"
                          alignItems="center"
                          color="white"
                          css={{
                            '&:hover': {
                              filter:
                                'sepia() brightness(0.9) saturate(10) hue-rotate(176deg)',
                            },
                          }}
                        >
                          <Image src={Telegram} width="20px" />
                        </Flex>
                      </AbsoluteLink>
                      <AbsoluteLink href="https://medium.com/bandprotocol">
                        <Flex
                          mr="20px"
                          alignItems="center"
                          color="white"
                          css={{
                            '&:hover': {
                              filter:
                                'sepia() brightness(0.9) saturate(10) hue-rotate(176deg)',
                            },
                          }}
                        >
                          <Image src={Medium} width="20px" />
                        </Flex>
                      </AbsoluteLink>
                      <AbsoluteLink href="https://twitter.com/bandprotocol">
                        <Flex
                          mr="20px"
                          alignItems="center"
                          color="white"
                          css={{
                            '&:hover': {
                              filter:
                                'sepia() brightness(0.9) saturate(10) hue-rotate(176deg)',
                            },
                          }}
                        >
                          <Image src={Twitter} width="20px" />
                        </Flex>
                      </AbsoluteLink>
                      <AbsoluteLink href="https://www.reddit.com/r/bandprotocol">
                        <Flex
                          mr="20px"
                          alignItems="center"
                          color="white"
                          css={{
                            '&:hover': {
                              filter:
                                'sepia() brightness(0.9) saturate(10) hue-rotate(176deg)',
                            },
                          }}
                        >
                          <Image src={Reddit} width="20px" />
                        </Flex>
                      </AbsoluteLink>
                      <AbsoluteLink href="https://github.com/bandprotocol">
                        <Flex
                          mr="20px"
                          alignItems="center"
                          color="white"
                          css={{
                            '&:hover': {
                              filter:
                                'sepia() brightness(0.9) saturate(10) hue-rotate(176deg)',
                            },
                          }}
                        >
                          <Image src={Github} width="20px" />
                        </Flex>
                      </AbsoluteLink>
                    </Flex>
                  </Flex>
                </Box>
                {/* {!_isMobile && (
              <Flex flex={1} justifyContent="flex-end" alignItems="center">
                <Image src={HeroSrc} width="50vw" />
              </Flex>
            )} */}
              </Flex>
            </PageContainer>
          </Box>
        </Box>

        {/* Testnet live bar */}
        <Flex
          bg="#dce1ff"
          justifyContent="center"
          mx={['calc(50vw - 400px)', 'calc(480px - 50vw)']}
          alignItems="center"
          fontWeight="900"
          flexDirection={['column', 'row']}
          style={{
            height: '65px',
            fontFamily: 'bio-sans',
            fontSize: _isMobile ? 14 : 16,
          }}
        >
          Introducing
          {_isMobile ? (
            <Flex
              mt="8px"
              flexDirection="column"
              fontSize="11px"
              alignItems="center"
            >
              <Flex>
                <a
                  href="https://bitswing.bandprotocol.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Text color="#5569de" mx="5px">
                    BitSwing
                  </Text>
                </a>
                - the first dapp built with Band Protocol on Kovan.
              </Flex>
              <a
                href="https://medium.com/bandprotocol/7750fe756ecf"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Text color="#5569de" mx="5px" mt="5px">
                  Learn more.
                </Text>
              </a>
            </Flex>
          ) : (
            <Flex mt={['5px', '0px']}>
              <a
                href="https://bitswing.bandprotocol.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Text color="#5569de" mx="5px">
                  BitSwing
                </Text>
              </a>
              - the first dapp built with Band Protocol on Kovan.
              <a
                href="https://medium.com/bandprotocol/7750fe756ecf"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Text color="#5569de" mx="5px">
                  Learn more.
                </Text>
              </a>
            </Flex>
          )}
        </Flex>

        {/* Section 2: Connecting to ... */}
        <Box
          style={{
            backgroundImage: 'linear-gradient(to bottom, #ffffff 30%, #d8dfff)',
          }}
        >
          <PageContainer>
            <Flex
              pt={['20px', '100px']}
              pb={['50px', '150px']}
              flexDirection={['column', 'row']}
            >
              {/* Connect to Real-World Information */}
              <Flex flexDirection="column" alignItems="flex-start" mt="50px">
                <Image src={LandingRealworld} />
                <Flex
                  flexDirection={['column', 'row']}
                  alignItems={['flex-start', 'center']}
                  fontSize={['18px', '24px']}
                  mt="35px"
                  mb="10px"
                  style={{
                    lineHeight: '2.25',
                    fontWeight: 'bold',
                    fontFamily: 'bio-sans',
                  }}
                >
                  <Text color="#3b426b">Connect to</Text>
                  <Text color="#5569de" ml={['0px', '5px']}>
                    Real-World Information
                  </Text>
                </Flex>

                <Text
                  fontSize={['14px', '16px']}
                  color="text"
                  style={{ lineHeight: '2' }}
                >
                  Without access to external data, the use cases for dApps are
                  limited. Prediction markets are too illiquid to be practical.
                  Band Protocol provides community-curated on-chain data feeds,
                  backed by strong economic incentives which ensure the data
                  stays accurate.
                </Text>
                <Flex
                  mt="15px"
                  style={{ fontFamily: 'bio-sans', fontWeight: 'bold' }}
                >
                  <LinkWithArrow
                    text="Explore Data"
                    href="https://app.kovan.bandprotocol.com/"
                  />
                  <LinkWithArrow
                    text="How it works"
                    ml={['40px', '76px']}
                    to="/features/tcd"
                  />
                </Flex>
              </Flex>

              {/* Separator line */}
              {_isMobile ? null : (
                <Box
                  width="3px"
                  bg="#c8d2ff"
                  style={{ height: '260px', alignSelf: 'flex-end' }}
                  mx="55px"
                />
              )}

              {/* Connect to Any Open API */}
              <Flex
                flexDirection="column"
                alignItems="flex-start"
                mt={['40px', '0px']}
              >
                <Image src={LandingOpenAPI} />
                <Flex
                  flexDirection={['column', 'row']}
                  alignItems={['flex-start', 'center']}
                  fontSize={['18px', '24px']}
                  mt="35px"
                  mb="10px"
                  style={{
                    lineHeight: '2.25',
                    fontWeight: 'bold',
                    fontFamily: 'bio-sans',
                  }}
                >
                  <Text color="#3b426b">Connect to</Text>
                  <Text color="#5569de" ml={['0px', '5px']}>
                    Any Open API
                  </Text>
                </Flex>
                <Text
                  fontSize={['14px', '16px']}
                  color="text"
                  style={{ lineHeight: '2' }}
                >
                  Band Protocol provides an infrastucture for blockchain
                  applications to connect with any open API without relying on a
                  centralized party. This allows dApps to leverage existing data
                  on the internet without compromising security, bridging the
                  use cases between Web 2.0 and 3.0.
                </Text>
                <Flex
                  mt="15px"
                  style={{ fontFamily: 'bio-sans', fontWeight: 'bold' }}
                >
                  <LinkWithArrow
                    text="Explore Endpoints"
                    href="https://app.kovan.bandprotocol.com/"
                  />
                  <LinkWithArrow
                    text="Learn more"
                    ml={['40px', '76px']}
                    href="https://developer.bandprotocol.com/"
                  />
                </Flex>
              </Flex>
            </Flex>
          </PageContainer>

          {/* Section 3: The floating card */}
          <Flex
            mb="20px"
            mt="-120px"
            py="60px"
            px={['20px', '80px']}
            justifyContent="space-between"
            style={{
              // width: ['calc(100vw - 40px)', '1200px'],
              maxWidth: '1520px',
              height: ['290px', '370px'],
              boxShadow: '0 5px 20px rgba(0, 0, 0, 0.15)',
              borderRadius: '10px',
              boxShadow: '0 2px 20px 0 #d3dbff',
              backgroundColor: '#ffffff',
              margin: '40px auto',
            }}
          >
            {/* Left */}
            <Flex
              style={{ maxWidth: '800px' }}
              my={['20px', '0px']}
              flexDirection="column"
            >
              <Text
                fontSize={['24px', '36px']}
                fontWeight="bold"
                color="#3b426b"
                lineHeight={['1.3', '1']}
                style={{ fontFamily: 'bio-sans' }}
              >
                Bring Blockchain Closer to Mass Adoption
              </Text>
              <Text
                fontSize={['14px', '16px']}
                lineHeight={2}
                color="text"
                mt="32px"
              >
                Data availability and reliability in decentralized platforms has
                restricted adoption since the inception of smart contracts. Band
                Protocol provides a standard framework for the decentralized
                management of data, serving as a fundamental query layer for
                applications that requires access to off-chain information. This
                eliminates the critical centralizing trust and points of failure
                that the oracle problem typically introduces to decentralized
                applications with other designs.
              </Text>
              <Flex flexDirection="column">
                <Flex alignItems="center" mt={['30px', '60px']}>
                  <Box
                    width="67px"
                    bg="#232323"
                    mr="15px"
                    style={{ height: '2px' }}
                  />
                  <Flex alignItems="center">
                    <Text
                      fontSize="18px"
                      fontWeight="bold"
                      color="#4a4a4a"
                      textAlign={['center', 'left']}
                      style={{ fontFamily: 'bio-sans' }}
                    >
                      What
                    </Text>
                    <Text
                      fontSize="18px"
                      fontWeight="bold"
                      mx="5px"
                      color="#5569de"
                      style={{ fontFamily: 'bio-sans' }}
                    >
                      Band Solves
                    </Text>
                    <Text
                      fontSize="18px"
                      fontWeight="bold"
                      color="#4a4a4a"
                      style={{ fontFamily: 'bio-sans' }}
                    >
                      :
                    </Text>
                  </Flex>
                </Flex>
                <Flex
                  mt="30px"
                  justifyContent="space-between"
                  flexWrap={['wrap', 'wrap']}
                  style={{ maxWidth: '650px' }}
                >
                  {/* 1 */}
                  <Flex
                    alignItems="center"
                    style={{ cursor: 'pointer' }}
                    onClick={() =>
                      window.setTimeout(
                        () =>
                          _isSmallMobile
                            ? window.scroll(0, extraHeigt + 2760)
                            : _isMobile
                            ? window.scroll(0, extraHeigt + 2560)
                            : window.scroll(0, extraHeigt + 2300),
                        10,
                      )
                    }
                  >
                    <CircleLink />
                    <Text ml="20px" fontSize={['14px', '16px']} color="#4a4a4a">
                      Data Availability
                    </Text>
                  </Flex>

                  {/* 2 */}
                  <Flex
                    alignItems="center"
                    mt={['15px', '0px']}
                    ml={['0px', '40px']}
                    style={{ cursor: 'pointer' }}
                    onClick={() =>
                      window.setTimeout(
                        () =>
                          _isSmallMobile
                            ? window.scroll(0, extraHeigt + 3600)
                            : _isMobile
                            ? window.scroll(0, extraHeigt + 3370)
                            : window.scroll(0, extraHeigt + 3300),
                        10,
                      )
                    }
                  >
                    <CircleLink />
                    <Text ml="20px" fontSize={['14px', '16px']} color="#4a4a4a">
                      Aligned Economic Incentives
                    </Text>
                  </Flex>

                  {/* 3 */}
                  <Flex
                    alignItems="center"
                    mt={['15px', '15px']}
                    style={{ cursor: 'pointer' }}
                    onClick={() =>
                      window.setTimeout(
                        () =>
                          _isSmallMobile
                            ? window.scroll(0, extraHeigt + 3200)
                            : _isMobile
                            ? window.scroll(0, extraHeigt + 2980)
                            : window.scroll(0, extraHeigt + 2820),
                        10,
                      )
                    }
                  >
                    <CircleLink />
                    <Text ml="20px" fontSize={['14px', '16px']} color="#4a4a4a">
                      Data Reliability
                    </Text>
                  </Flex>

                  {/* 4 */}
                  <Flex
                    alignItems="center"
                    mt={['15px', '15px']}
                    mr={['0px', '18px']}
                    style={{ cursor: 'pointer' }}
                    onClick={() =>
                      window.setTimeout(
                        () =>
                          _isSmallMobile
                            ? window.scroll(0, extraHeigt + 4050)
                            : _isMobile
                            ? window.scroll(0, extraHeigt + 3850)
                            : window.scroll(0, extraHeigt + 3800),
                        10,
                      )
                    }
                  >
                    <CircleLink />
                    <Text ml="20px" fontSize={['14px', '16px']} color="#4a4a4a">
                      Decentralizing Trust Point
                    </Text>
                  </Flex>
                </Flex>
              </Flex>
            </Flex>
            {/* Right */}
            {_isMobile ? null : (
              <Flex alignItems="center" justifyContent="center" flex={1}>
                <Box>
                  <Image src={LandingMassAdoption} />
                </Box>
              </Flex>
            )}
          </Flex>

          {/* Section 4 */}
          <Box
            mt={['40px', '200px']}
            mx="auto"
            mb={['0px', '0px']}
            style={{
              height: _isMobile ? '1720px' : '2000px',
              backgroundImage: `${!_isMobile && `url(${LandingFeature})`}`,
              backgroundSize: '1400px',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'top center',
              zIndex: 0,
            }}
          >
            <PageContainer style={{ position: 'relative' }}>
              {/* Part 1: Band Feeds Data On-Chain Right When You Need */}
              <Flex
                flexDirection="column"
                pl={['20px', '0px']}
                pr={['30px', '0px']}
                justifyContent="center"
                style={{ position: 'absolute', top: 30, left: 0 }}
              >
                <Text
                  fontSize={['16px', '20px']}
                  fontWeight="400"
                  color="#546ee5"
                >
                  Data Availability
                </Text>
                <Text
                  color="#3b426b"
                  fontFamily="bio-sans"
                  fontSize={['24px', '40px']}
                  fontWeight="bold"
                  mb="10px"
                  mt="10px"
                  style={{ lineHeight: '1.5' }}
                >
                  Band Feeds Data On-Chain
                  <br />
                  Right When You Need
                </Text>
                <Text
                  mt={2}
                  fontSize={['16px', '18px']}
                  fontWeight="400"
                  color="text"
                  style={{ lineHeight: '2', maxWidth: '600px' }}
                >
                  For high-demand data such as ETH/USD price, the data are
                  updated and kept on-chain on a regular basis. DApps can
                  request and use the data with just one simple function call.
                </Text>
                <Flex mt={['15px', '20px']}>
                  <LinkWithArrow
                    text="Explore Datasets Available"
                    href="https://app.kovan.bandprotocol.com/"
                  />
                </Flex>
              </Flex>

              {/* Part 2: Band Aggregates Data from Multiple Providers */}
              <Flex
                flexDirection="column"
                justifyContent="center"
                pl={['20px', '0px']}
                pr={['0px', '0px']}
                style={{
                  position: 'absolute',
                  top: _isMobile ? '450px' : '540px',
                  right: _isMobile ? 0 : '30px',
                }}
              >
                <Text
                  fontSize={['16px', '20px']}
                  fontWeight="400"
                  color="#546ee5"
                >
                  Data Reliability
                </Text>
                <Text
                  color="#3b426b"
                  fontFamily="bio-sans"
                  fontSize={['24px', '40px']}
                  fontWeight="bold"
                  mb="10px"
                  mt="10px"
                  style={{ lineHeight: '1.5' }}
                >
                  Band Aggregates Data
                  <br />
                  from Multiple Providers
                </Text>
                <Text
                  mt={2}
                  fontSize={['16px', '18px']}
                  fontWeight="400"
                  color="text"
                  pr={['30px', '0px']}
                  style={{ lineHeight: '2', maxWidth: '600px' }}
                >
                  Band enforces strict requirements before serving each query.
                  Each data point requires more than ⅔ of qualified providers to
                  serve the data, which guarantees high tolerance for collusion.
                </Text>
                <Flex mt={['15px', '20px']}>
                  <LinkWithArrow
                    text="Learn How Data Curation Works"
                    to="/features/tcd"
                  />
                </Flex>
              </Flex>

              {/* Part 3: Dataset Tokens on Bonding Curves */}
              <Flex
                flexDirection="column"
                pl={['20px', '0px']}
                pr={['30px', '0px']}
                justifyContent="center"
                style={{
                  position: 'absolute',
                  top: _isMobile ? '850px' : '1020px',
                  left: 0,
                }}
              >
                <Text
                  fontSize={['16px', '20px']}
                  fontWeight="400"
                  color="#546ee5"
                >
                  Aligned Economic Incentives
                </Text>
                <Text
                  color="#3b426b"
                  fontFamily="bio-sans"
                  fontSize={['24px', '40px']}
                  fontWeight="bold"
                  mb="10px"
                  mt="10px"
                  style={{ lineHeight: '1.5' }}
                >
                  Dataset Tokens on
                  <br />
                  Bonding Curves
                </Text>
                <Text
                  mt={2}
                  fontSize={['16px', '18px']}
                  fontWeight="400"
                  color="text"
                  style={{ lineHeight: '2', maxWidth: '600px' }}
                >
                  Each dataset has its own token for governing how the dataset
                  functions. It incentivizes token holders and data providers to
                  curate high-quality data, which in-turn drives greater
                  security for dApps.
                </Text>
                <Flex mt={['15px', '20px']}>
                  {_isMobile ? (
                    <LinkWithArrow
                      text={
                        <Flex flexDirection="column" alignItems="flex-start">
                          <Text>Learn How Dual-Token</Text>
                          <Text>Economics Works</Text>
                        </Flex>
                      }
                      to="/features/dual-token"
                    />
                  ) : (
                    <LinkWithArrow
                      text="Learn How Dual-Token Economics Works"
                      to="/features/dual-token"
                    />
                  )}
                </Flex>
              </Flex>

              {/* Part 4: Community Runs Datasets and Grows Together */}
              <Flex
                flexDirection="column"
                pl={['0px', '0px']}
                pr={['0px', '0px']}
                justifyContent="center"
                style={{
                  position: 'absolute',
                  top: _isMobile ? '1310px' : '1580px',
                  right: _isMobile ? 'unset' : '30px',
                }}
              >
                <Text
                  fontSize={['16px', '20px']}
                  fontWeight="400"
                  color="#546ee5"
                >
                  Decentralizing Trust Point
                </Text>
                <Text
                  color="#3b426b"
                  fontFamily="bio-sans"
                  fontSize={['24px', '40px']}
                  fontWeight="bold"
                  pr={['20px', '0px']}
                  mb="10px"
                  mt="10px"
                  style={{ lineHeight: '1.5' }}
                >
                  Community Runs
                  <br />
                  Datasets and Grows Together
                </Text>
                <Text
                  mt={2}
                  fontSize={['16px', '18px']}
                  fontWeight="400"
                  pr={['50px', '0px']}
                  color="text"
                  style={{ lineHeight: '2', maxWidth: '600px' }}
                >
                  Band provides a decentralized, unstoppable platform for
                  community to curate reliable data. No single identity has
                  authority to bypass governance and take control of the data.
                </Text>
                <Flex mt={['15px', '20px']}>
                  <LinkWithArrow
                    text="Learn How to Participate in Curation"
                    to="/features/data-governance-portal"
                  />
                </Flex>
              </Flex>
            </PageContainer>
          </Box>

          {/* Section 5 */}
          <Box>
            <PageContainer>
              <Flex flexDirection="column" alignItems="center">
                {/* Explore more feature button */}
                <Flex justifyContent="center" mt={['50px', '50px']}>
                  <FilledButton
                    width={_isMobile ? '220px' : '500px'}
                    message={
                      _isMobile
                        ? 'Explore More'
                        : 'Explore Band Protocol Features'
                    }
                    arrow
                    fontSize={_isMobile ? '14px' : '16px'}
                    to="/features/overview"
                  />
                </Flex>

                {/* Stay update */}
                <Flex
                  mt={['50px', '80px']}
                  bg="#0c154c"
                  flexDirection="column"
                  alignItems="center"
                  pt="50px"
                  pb="70px"
                  color="white"
                  fontSize="20px"
                  style={{
                    position: 'relative',
                    zIndex: 1,
                    fontFamily: 'bio-sans',
                    width: '1000px',
                  }}
                >
                  {_isMobile ? (
                    <React.Fragment>
                      <Text textAlign="center" mb="30px">
                        Stay up to date by subscribe us
                      </Text>
                      <Subscribe column />
                    </React.Fragment>
                  ) : (
                    <React.Fragment>
                      <Text
                        textAlign="center"
                        style={{ maxWidth: '550px', lineHeight: '1.71' }}
                      >
                        <Highlight>Stay up to date on</Highlight> the latest
                        news <Highlight>about how</Highlight> Band Protocol{' '}
                        <Highlight>brings more use cases to</Highlight> smart
                        contracts
                      </Text>
                      <Text textAlign="center" mt="30px">
                        <Subscribe />
                      </Text>
                    </React.Fragment>
                  )}
                </Flex>
              </Flex>
            </PageContainer>
          </Box>
        </Box>
        <Box
          bg="#344498"
          width="100%"
          mt="-125px"
          style={{ height: '130px', zIndex: 0, position: 'relative' }}
        />
      </Box>
    </>
  )
}
