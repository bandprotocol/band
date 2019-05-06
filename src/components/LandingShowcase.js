import React from 'react'
import PageContainer from 'components/PageContainer'
import { Flex, Text, Image, Box } from 'ui/common'
import { isMobile } from 'ui/media'

export default class LandingShowcase extends React.Component {
  state = {
    selectedTab: 1,
  }

  onSelectTab(tabId) {
    this.setState({ selectedTab: tabId })
  }
  render() {
    const {
      background,
      title,
      description,
      link1,
      link2,
      Logo,
      Img1,
      Img2,
      Img3,
    } = this.props
    const { selectedTab } = this.state
    const getWHByTab = tab =>
      tab === selectedTab
        ? { width: '410px', height: '335px', opacity: 1 }
        : { width: '360px', height: '270px', opacity: 0.4 }
    return (
      <Box py={5} style={{ background: background }}>
        <PageContainer>
          <Text textAlign="center" fontWeight="600" fontSize="32px">
            Applications Developed with Band Protocol
          </Text>
          <Flex flexDirection="row" justifyContent="center" mt="70px">
            <Image src={Logo} width="181px" />
            <Flex ml="110px" flexDirection="column" style={{ width: '620px' }}>
              <Text fontSize="18px">{title}</Text>
              <Flex mt="20px">
                <Text fontSize="16px" color="#8d94bf" lineHeight={1.75}>
                  {description}
                </Text>
              </Flex>
              <Flex flexDirection="row" mt="20px">
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
                <Flex fontSize="16px">
                  {link2}
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
              mx="3px"
              style={{
                borderRadius: '4px',
                overflow: 'hidden',
                transition: 'all 0.5s',
                ...getWHByTab(0),
              }}
            >
              <Image src={Img1} {...getWHByTab(0)} />
            </Flex>
            <Flex
              mx="3px"
              style={{
                borderRadius: '4px',
                overflow: 'hidden',
                transition: 'all 0.5s',
                ...getWHByTab(1),
              }}
            >
              <Image src={Img2} {...getWHByTab(1)} />
              <Flex />
            </Flex>
            <Flex
              mx="3px"
              style={{
                borderRadius: '4px',
                overflow: 'hidden',
                transition: 'all 0.5s',
                ...getWHByTab(2),
              }}
            >
              <Image src={Img3} {...getWHByTab(2)} />
            </Flex>
          </Flex>
          <Flex mt="35px" flexDirection="row" justifyContent="center">
            <Flex
              onClick={() => this.onSelectTab(0)}
              style={{
                width: '48px',
                height: '4px',
                borderRadius: '1px',
                cursor: 'pointer',
              }}
              bg={selectedTab === 0 ? '#6b8bf5' : '#f7f8ff'}
            />
            <Flex
              mx="10px"
              onClick={() => this.onSelectTab(1)}
              style={{
                width: '48px',
                height: '4px',
                borderRadius: '1px',
                cursor: 'pointer',
              }}
              bg={selectedTab === 1 ? '#6b8bf5' : '#f7f8ff'}
            />
            <Flex
              onClick={() => this.onSelectTab(2)}
              style={{
                width: '48px',
                height: '4px',
                borderRadius: '1px',
                cursor: 'pointer',
              }}
              bg={selectedTab === 2 ? '#6b8bf5' : '#f7f8ff'}
            />
          </Flex>
        </PageContainer>
      </Box>
    )
  }
}
