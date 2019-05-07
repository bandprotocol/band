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
    const { background, Img1, Img2, Img3, children } = this.props
    const { selectedTab } = this.state
    const getWHByTab = tab =>
      tab === selectedTab
        ? { width: '410px', height: '335px', opacity: 1 }
        : { width: '360px', height: '270px', opacity: 0.6 }
    return (
      <Box pb={4} mx="-80px" style={{ background: background }}>
        <PageContainer>
          {children}

          <Flex
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
              <Image
                src={Img1}
                {...getWHByTab(0)}
                onClick={() => this.onSelectTab(0)}
              />
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
              <Image
                src={Img2}
                {...getWHByTab(1)}
                onClick={() => this.onSelectTab(1)}
              />
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
              <Image
                src={Img3}
                {...getWHByTab(2)}
                onClick={() => this.onSelectTab(2)}
              />
            </Flex>
          </Flex>
          <Flex mt="35px" flexDirection="row" justifyContent="center">
            <Flex
              onClick={() => this.onSelectTab(0)}
              style={{
                width: '48px',
                height: '6px',
                borderRadius: '1px',
                cursor: 'pointer',
              }}
              bg={selectedTab === 0 ? '#6b8bf5' : '#cdd3ff'}
            />
            <Flex
              mx="10px"
              onClick={() => this.onSelectTab(1)}
              style={{
                width: '48px',
                height: '6px',
                borderRadius: '1px',
                cursor: 'pointer',
              }}
              bg={selectedTab === 1 ? '#6b8bf5' : '#cdd3ff'}
            />
            <Flex
              onClick={() => this.onSelectTab(2)}
              style={{
                width: '48px',
                height: '6px',
                borderRadius: '1px',
                cursor: 'pointer',
              }}
              bg={selectedTab === 2 ? '#6b8bf5' : '#cdd3ff'}
            />
          </Flex>
        </PageContainer>
      </Box>
    )
  }
}
