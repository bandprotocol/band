import React, { useState } from 'react'
import styled from 'styled-components/macro'
import PageContainer from 'components/PageContainer'
import { Flex, Text, Image, Box, Link, AbsoluteLink } from 'ui/common'
import { isMobile } from 'ui/media'

export default ({
  background,
  title,
  description,
  link1,
  link2,
  Logo,
  Img1,
  Img2,
  Img3,
  children,
}) => {
  const _isMobile = isMobile()
  const [selectedTab, setSelectedTab] = useState(1)
  const offset = _isMobile ? '100' : '280'
  const getWHByTab = tab => {
    if (tab === selectedTab) {
      return { transform: 'scale(1)', opacity: 1, zIndex: 1 }
    }
    const styleObj = { opacity: 0.4, zIndex: 0 }
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
          <Flex
            width={[1, '181px']}
            style={{ minWidth: '181px' }}
            justifyContent="center"
          >
            <Image src={Logo} width="181px" />
          </Flex>
          <Flex
            ml={['0px', '110px']}
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
            <Flex flexDirection={['column', 'row']} mt="20px">
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
          mt={['calc(75vw - 20px)', '355px']}
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
        <Flex mt="35px" flexDirection="row" justifyContent="center">
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
          />
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
          />
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
          />
        </Flex>
      </PageContainer>
    </Box>
  )
}
