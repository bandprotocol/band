import React from 'react'
import PageContainer from 'components/PageContainer'
import { colors } from 'ui'
import { Flex, Text, Box } from 'ui/common'
import CircleLoadingSpinner from 'components/CircleLoadingSpinner'
import MegaCommunityCard from 'components/MegaCommunityCard'

const YourCommunities = ({ yourCommunities, bandPrice, history }) => {
  if (yourCommunities.length === 0) return <div />
  return (
    <Box style={{ width: '100%' }}>
      <PageContainer dashboard>
        <Text
          fontSize="16px"
          color={colors.text.normal}
          fontWeight="600"
          pt={3}
        >
          YOUR COMMUNITIES
        </Text>
        <Flex flexWrap="wrap" mt={2} mx="-20px" justifyContent="flex-start">
          {yourCommunities.map(yourCommunity => (
            <MegaCommunityCard
              key={yourCommunity.name}
              community={yourCommunity}
              bandPrice={bandPrice}
              onClick={() =>
                history.push(`/community/${yourCommunity.address}/overview`)
              }
            />
          ))}
        </Flex>
      </PageContainer>
    </Box>
  )
}

const FeatureCommunity = ({ featureCommunities, bandPrice, history }) => {
  if (featureCommunities.length === 0) return <div />
  return (
    <Box bg="#fafbfd" style={{ width: '100%' }}>
      <PageContainer dashboard>
        <Text
          fontSize="16px"
          color={colors.text.normal}
          fontWeight="600"
          pt={3}
        >
          FEATURED COMMUNITIES
        </Text>
        <Flex flexWrap="wrap" mt={3} mx="-20px" justifyContent="flex-start">
          {featureCommunities.map(featureCommunity => (
            <MegaCommunityCard
              key={featureCommunity.name}
              community={featureCommunity}
              bandPrice={bandPrice}
              style={{}}
              onClick={() =>
                history.push(`/community/${featureCommunity.address}/overview`)
              }
            />
          ))}
        </Flex>
      </PageContainer>
    </Box>
  )
}

export default ({
  communities,
  yourCommunities,
  featureCommunities,
  bandPrice,
  history,
}) => (
  <PageContainer
    fullWidth
    style={{ minHeight: 'calc(100vh - 80px)', background: '#f6f7fc' }}
  >
    {/* TODO: Fix this condition(loading forever when length === 0) and
    check yourcommunity, feature community as well */}
    {communities ? (
      <Flex flexDirection="column">
        {/* All Communities */}
        <Box style={{ width: '100%', height: '100%' }}>
          <PageContainer dashboard>
            <Text
              fontSize="16px"
              mt="12px"
              mb={3}
              fontWeight="900"
              color="#393939"
            >
              ALL COMMUNITIES
            </Text>
            <Flex flexWrap="wrap" mt={3} mx="-20px" justifyContent="flex-start">
              {communities.map((community, i) => (
                <MegaCommunityCard
                  key={i}
                  community={community}
                  onClick={() =>
                    history.push(`/community/${community.address}/overview`)
                  }
                />
              ))}
            </Flex>
          </PageContainer>
        </Box>
      </Flex>
    ) : (
      // Loading icon
      <Flex
        style={{ height: 225 }}
        width="100%"
        alignItems="center"
        justifyContent="center"
      >
        <CircleLoadingSpinner radius="80px" />
      </Flex>
    )}
  </PageContainer>
)
