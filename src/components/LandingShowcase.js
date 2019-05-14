import React, { useState } from 'react'
import styled from 'styled-components/macro'
import PageContainer from 'components/PageContainer'
import { Flex, Text, Image, Box, Link, AbsoluteLink } from 'ui/common'

const offsets = ['60', '80', '100', '250', '280', '300', '350']

const getOffset = () => {
  let index = Math.floor(window.innerWidth / 200)
  index = index > offsets.length - 1 ? offsets.length - 1 : index
  return offsets[index]
}

export default ({
  background,
  title,
  description,
  link1,
  link2,
  Logo,
  logoHeight,
  Img1,
  Img2,
  Img3,
  children,
}) => {
  const [selectedTab, setSelectedTab] = useState(1)
  const offset = getOffset()
  const getWHByTab = tab => {
    if (tab === selectedTab) {
      return {
        transform: 'scale(1)',
        opacity: 1,
        zIndex: 1,
        boxShadow: '0 33px 40px 0 rgba(0, 0, 0, 0.5)',
      }
    }
    const styleObj = {
      opacity: 0.4,
      zIndex: 0,
      boxShadow: 'none',
    }
    if (selectedTab === 0 && tab === 1) {
      return {
        ...styleObj,
        transform: `scale(0.8) translateY(30px) translateX(${offset}px)`,
      }
    } else if (selectedTab === 0 && tab === 2) {
      return {
        ...styleObj,
        transform: `scale(0.8) translateY(30px) translateX(-${offset}px)`,
      }
    } else if (selectedTab === 1 && tab === 0) {
      return {
        ...styleObj,
        transform: `scale(0.8) translateY(30px) translateX(-${offset}px)`,
      }
    } else if (selectedTab === 1 && tab === 2) {
      return {
        ...styleObj,
        transform: `scale(0.8) translateY(30px) translateX(${offset}px)`,
      }
    } else if (selectedTab === 2 && tab === 0) {
      return {
        ...styleObj,
        transform: `scale(0.8) translateY(30px) translateX(${offset}px)`,
      }
    }
    return {
      ...styleObj,
      transform: `scale(0.8) translateY(30px) translateX(-${offset}px)`,
    }
  }

  return (
    <Box
      pt={children ? ['45px', 5] : ['10px', '10px']}
      pb={['45px', 5]}
      style={{ background: background }}
      color="white"
    >
      <PageContainer>
        {children}
        <Flex
          flexDirection={['column', 'row']}
          justifyContent="center"
          mt={['20px', '70px']}
        >
          <Flex justifyContent="center" style={{ minWidth: '250px' }}>
            <Image src={Logo} height={logoHeight} />
          </Flex>
          <Flex
            ml={['0px', '20px', '110px']}
            mt={['20px', '0px']}
            flexDirection="column"
            style={{ width: ['calc(100vw - 40px)', '620px'] }}
          >
            <Text fontSize="18px">{title}</Text>
            <Flex mt="20px">
              <Text fontSize="16px" color="#8d94bf" lineHeight={1.75}>
                {description}
              </Text>
            </Flex>
            <Flex flexDirection={['column', 'column', 'row']} mt="20px">
              <Flex fontSize="16px" mr="85px">
                <AbsoluteLink
                  target="_blank"
                  rel="noopener noreferrer"
                  href={'https://' + link1.toLowerCase()}
                >
                  {link1}
                </AbsoluteLink>
                <Flex mx="5px" />
                <Text color="#6b8bf5" fontSize="18px">
                  <i className="fas fa-arrow-right" />
                </Text>
              </Flex>
              <Flex fontSize="16px" mt={['20px', '0px']}>
                <Link
                  css={{
                    '&:hover': {
                      color: '#bfcdff',
                    },
                  }}
                  to={
                    link2.indexOf('DataSource') >= 0
                      ? 'products/tcd'
                      : 'products/tcr'
                  }
                >
                  {link2}
                </Link>
                <Flex mx="5px" />
                <Text color="#6b8bf5" fontSize="18px">
                  <i className="fas fa-arrow-right" />
                </Text>
              </Flex>
            </Flex>
          </Flex>
        </Flex>
        <Flex
          mt={['calc(75vw - 20px)', '400px']}
          flexDirection="row"
          alignItems="flex-end"
          justifyContent="center"
          style={{ position: 'relative' }}
        >
          <Flex
            style={{
              borderRadius: '4px',
              overflow: 'hidden',
              cursor: 'pointer',
              transition: 'all 0.5s',
              position: 'absolute',
              ...getWHByTab(0),
            }}
          >
            <Image
              src={Img1}
              width={['calc(75vw - 15px)', '410px']}
              height={['calc((75vw - 15px) * 0.8)', '335px']}
              onClick={() => setSelectedTab(0)}
            />
          </Flex>
          <Flex
            style={{
              borderRadius: '4px',
              overflow: 'hidden',
              cursor: 'pointer',
              transition: 'all 0.5s',
              position: 'absolute',
              ...getWHByTab(1),
            }}
          >
            <Image
              src={Img2}
              width={['calc(75vw - 15px)', '410px']}
              height={['calc((75vw - 15px) * 0.8)', '335px']}
              onClick={() => setSelectedTab(1)}
            />
            <Flex />
          </Flex>
          <Flex
            style={{
              borderRadius: '4px',
              overflow: 'hidden',
              cursor: 'pointer',
              transition: 'all 0.5s',
              position: 'absolute',
              ...getWHByTab(2),
            }}
          >
            <Image
              src={Img3}
              width={['calc(75vw - 15px)', '410px']}
              height={['calc((75vw - 15px) * 0.8)', '335px']}
              onClick={() => setSelectedTab(2)}
            />
          </Flex>
        </Flex>
        <Flex
          style={{ minHeight: '75px' }}
          flexDirection="row"
          justifyContent="center"
          alignItems="flex-end"
        >
          <Flex
            onClick={() => setSelectedTab(0)}
            style={{
              width: '48px',
              height: '4px',
              borderRadius: '1px',
              cursor: 'pointer',
              transition: 'all 0.5s',
            }}
            bg={selectedTab === 0 ? '#6b8bf5' : '#f7f8ff'}
          >
            <Flex
              bg="#6b8bf5"
              flex={1}
              style={{
                opacity: selectedTab === 0 ? 1 : 0,
                filter: `blur(${selectedTab === 0 ? 5 : 0}px)`,
              }}
            />
          </Flex>
          <Flex
            mx="10px"
            onClick={() => setSelectedTab(1)}
            style={{
              width: '48px',
              height: '4px',
              borderRadius: '1px',
              cursor: 'pointer',
              transition: 'all 0.5s',
            }}
            bg={selectedTab === 1 ? '#6b8bf5' : '#f7f8ff'}
          >
            <Flex
              bg="#6b8bf5"
              flex={1}
              style={{
                opacity: selectedTab === 1 ? 1 : 0,
                filter: `blur(${selectedTab === 1 ? 5 : 0}px)`,
              }}
            />
          </Flex>
          <Flex
            onClick={() => setSelectedTab(2)}
            style={{
              width: '48px',
              height: '4px',
              borderRadius: '1px',
              cursor: 'pointer',
              transition: 'all 0.5s',
            }}
            bg={selectedTab === 2 ? '#6b8bf5' : '#f7f8ff'}
          >
            <Flex
              bg="#6b8bf5"
              flex={1}
              style={{
                opacity: selectedTab === 2 ? 1 : 0,
                filter: `blur(${selectedTab === 2 ? 5 : 0}px)`,
              }}
            />
          </Flex>
        </Flex>
      </PageContainer>
    </Box>
  )
}
