import React from 'react'
import PageContainer from 'components/PageContainer'
import { colors } from 'ui'
import { Flex, Text, Box } from 'ui/common'
import CircleLoadingSpinner from 'components/CircleLoadingSpinner'
import MiniCommunityCard from 'components/MiniCommunityCard'
import MegaCommunityCard from 'components/MegaCommunityCard'

const YourCommunities = ({ yourCommunities, bandPrice, history }) => {
  if (yourCommunities.length === 0) return <div />
  return (
    <Box style={{ width: '100%' }}>
      <PageContainer dashboard>
        <Text
          fontSize="18px"
          color={colors.text.normal}
          fontWeight="500"
          pt={3}
          pb={2}
        >
          YOUR COMMUNITIES
        </Text>
        <Flex flexWrap="wrap" mt={3} mx="-20px" justifyContent="flex-start">
          {yourCommunities.map(yourCommunity => (
            <MegaCommunityCard
              key={yourCommunity.name}
              community={yourCommunity}
              bandPrice={bandPrice}
              onClick={() =>
                history.push(`/community/${yourCommunity.address}/detail`)
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
          fontSize="18px"
          color={colors.text.normal}
          fontWeight="500"
          pt={3}
          pb={2}
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
                history.push(`/community/${featureCommunity.address}/detail`)
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
    {communities && communities.length ? (
      <Flex flexDirection="column">
        {/* Your Communities */}
        <YourCommunities
          yourCommunities={yourCommunities}
          bandPrice={bandPrice}
          history={history}
        />
        {/* Feature Communities */}
        <FeatureCommunity
          featureCommunities={featureCommunities}
          bandPrice={bandPrice}
          history={history}
        />
        {/* All Communities */}
        <Box style={{ width: '100%', height: '100%' }}>
          <PageContainer dashboard>
            <Text fontSize="18px" color={colors.text.normal} fontWeight="500">
              ALL COMMUNITIES
            </Text>
            <Flex flexWrap="wrap" mt={3} mx="-5px" justifyContent="flex-start">
              {communities.map((community, i) => (
                <MiniCommunityCard
                  key={i}
                  community={community}
                  onClick={() =>
                    history.push(`/community/${community.address}/detail`)
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
