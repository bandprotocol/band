import React, { useState } from 'react'
import PageContainer from 'components/PageContainer'
import { Flex, Text, Image, Box, Link } from 'ui/common'
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
  const offset = _isMobile ? '40' : '80'
  const getWHByTab = tab =>
    tab === selectedTab
      ? { transform: 'scale(1)', opacity: 1, zIndex: 1 }
      : {
          transform: `scale(0.8) translateY(30px) translateX(${(tab === 0 &&
            offset) ||
            (tab === 1 && '0') ||
            (tab === 2 && '-' + offset)}px)`,
          opacity: 0.4,
          zIndex: 0,
        }

  return (
    <Box
      pt={children ? ['45px', 5] : ['10px', '10px']}
      pb={['45px', 5]}
      style={{ background: background }}
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
                <a
                  style={{ color: 'white' }}
                  target="_blank"
                  rel="noopener noreferrer"
                  href={'https://' + link1.toLowerCase()}
                >
                  {link1}
                </a>
                <Flex mx="5px" />
                <Text color="#6b8bf5" fontSize="18px">
                  <i className="fas fa-arrow-right" />
                </Text>
              </Flex>
              <Flex fontSize="16px" mt={['20px', '0px']}>
                <Link
                  style={{ color: 'white' }}
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
          mt="50px"
          align="flex-end"
          flexDirection="row"
          style={{ height: '335px' }}
          alignItems="flex-end"
        >
          <Flex
            style={{
              borderRadius: '4px',
              overflow: 'hidden',
              cursor: 'pointer',
              transition: 'all 0.5s',
              ...getWHByTab(0),
              width: ['calc(100vw - 20px)', '410px'],
              height: ['calc((100vw - 20px) * 0.8)', '335px'],
            }}
          >
            <Image
              src={Img1}
              width={['calc(100vw - 20px)', '410px']}
              height={['calc((100vw - 20px) * 0.8)', '335px']}
              onClick={() => setSelectedTab(0)}
            />
          </Flex>
          <Flex
            style={{
              borderRadius: '4px',
              overflow: 'hidden',
              cursor: 'pointer',
              transition: 'all 0.5s',
              ...getWHByTab(1),
              width: ['calc(100vw - 20px)', '410px'],
              height: ['calc((100vw - 20px) * 0.8)', '335px'],
            }}
          >
            <Image
              src={Img2}
              width={['calc(100vw - 20px)', '410px']}
              height={['calc((100vw - 20px) * 0.8)', '335px']}
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
              ...getWHByTab(2),
              width: ['calc(100vw - 20px)', '410px'],
              height: ['calc((100vw - 20px) * 0.8)', '335px'],
            }}
          >
            <Image
              src={Img3}
              width={['calc(100vw - 20px)', '410px']}
              height={['calc((100vw - 20px) * 0.8)', '335px']}
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
