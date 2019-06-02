import React from 'react'
import { Flex, Box, Text, Image, Button, Heading } from 'ui/common'
import PageStructure from 'components/DataSetPageStructure'
import PageContainer from 'components/PageContainer'
import styled from 'styled-components'
import Snippet from 'components/Snippet'
import DataPoint from 'components/DataPoint'
import FlipMove from 'react-flip-move'
import {
  IdentityFetcher,
  IdentityCountFetcher,
} from 'data/fetcher/IdentityFetcher'
import Loading from 'components/Loading'
import Search from 'components/Search'
import { createLoadingButton } from 'components/BaseButton'
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'
import IdentityIconSrc from 'images/icon-identity.svg'

const LoadMoreButton = createLoadingButton(styled(Button)`
  width: 200px;
  height: 40px;
  background-color: #7c84a6;
  margin: 10px 0px;
  cursor: pointer;
  border-radius: 20px;
  box-shadow: 0 3px 5px 0 rgba(0, 0, 0, 0.2);
  background-image: linear-gradient(to right, #5269ff, #4890ff);
`)

const renderDataPoints = (
  persons,
  currentIdentityLength,
  loadMoreList,
  onSearch,
  isSearching,
) => (
  <React.Fragment>
    <Flex>
      <Heading>{persons.length} Identities</Heading>
      <Box ml="auto">
        <Search width="330px" onSearch={onSearch} />
      </Box>
    </Flex>
    <Box mt={3}>
      <FlipMove>
        {persons.map(({ timestamp, userAddress }) => (
          <DataPoint
            key={userAddress}
            keyOnChain={userAddress}
            label={userAddress}
            k={timestamp}
            v={() => <div />}
            Logo={() => (
              <Flex alignItems="center" mr={2}>
                <Jazzicon
                  diameter={30}
                  seed={jsNumberForAddress(userAddress)}
                />
              </Flex>
            )}
            updatedAt={timestamp}
          />
        ))}
      </FlipMove>
    </Box>
    <IdentityCountFetcher>
      {({ fetching, data }) =>
        !currentIdentityLength ||
        fetching ||
        currentIdentityLength >= data ||
        isSearching ? null : (
          <Flex width="100%" justifyContent="center" alignItems="center">
            <LoadMoreButton onClick={loadMoreList}>
              Load More Data
            </LoadMoreButton>
          </Flex>
        )
      }
    </IdentityCountFetcher>
  </React.Fragment>
)

export default class IdentityPage extends React.Component {
  state = {
    nIdentityList: 10,
    searchAddress: '',
  }

  onSearch(forceFetch, value) {
    this.setState(
      {
        searchAddress: value,
      },
      () => forceFetch(true, true),
    )
  }

  async loadMoreList(forceFetch) {
    const currentLength = this.currentIdentityLength
    this.setState({
      nIdentityList: this.state.nIdentityList + 10,
    })

    await new Promise(r => {
      const fetchChecker = setInterval(() => {
        forceFetch(true, true)
      }, 1500)
      const checker = setInterval(() => {
        if (this.currentIdentityLength > currentLength) {
          clearInterval(checker)
          clearInterval(fetchChecker)
          r()
        }
      }, 500)
    })
  }

  render() {
    return (
      <PageStructure
        renderHeader={() => (
          <Flex
            alignItems="center"
            justifyContent="space-between"
            flexDirection="column"
          >
            <Text fontSize="36px" fontWeight="900">
              Identity Verification
            </Text>
            <Text fontSize="20px" my={3}>
              Prevent Sybil attack on your DApps via Band Identity Service
            </Text>
            <Button
              width="200px"
              mt={1}
              py="10px"
              onClick={() => this.props.showApplyIdentity()}
              style={{
                cursor: 'pointer',
                backgroundImage: 'linear-gradient(103deg, #fd8f59, #f6387b)',
              }}
            >
              <Flex
                flexDirection="row"
                alignItems="center"
                width="100%"
                justifyContent="space-between"
              >
                <Text fontSize="14px" fontWeight="900" color="white">
                  Apply for an Identity
                </Text>
                <Image src={IdentityIconSrc} />
              </Flex>
            </Button>
          </Flex>
        )}
        {...this.props}
      >
        <PageContainer>
          <Box mt="-100px">
            <Snippet dataset="identity" />
          </Box>
          <Box mt={5}>
            <IdentityFetcher
              nList={this.state.nIdentityList}
              searchAddress={this.state.searchAddress}
            >
              {({ fetching, data, forceFetch }) => {
                if (fetching) {
                  return (
                    <Loading
                      height={281}
                      width={924}
                      rects={[
                        [0, 0, 120, 32],
                        [880, 0, 32, 32],
                        [0, 52, 924, 61],
                        [0, 135, 924, 61],
                        [0, 218, 924, 61],
                      ]}
                    />
                  )
                } else {
                  this.currentIdentityLength = data.length
                  return renderDataPoints(
                    data,
                    this.currentIdentityLength,
                    this.loadMoreList.bind(this, forceFetch),
                    this.onSearch.bind(this, forceFetch),
                    this.state.searchAddress !== '',
                  )
                }
              }}
            </IdentityFetcher>
          </Box>
        </PageContainer>
      </PageStructure>
    )
  }
}
