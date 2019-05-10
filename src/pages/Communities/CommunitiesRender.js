import React from 'react'
import PageContainer from 'components/PageContainer'
import { colors } from 'ui'
import { Flex, Text, Box } from 'ui/common'
import CircleLoadingSpinner from 'components/CircleLoadingSpinner'
import MegaCommunityCard from 'components/MegaCommunityCard'

export default ({ communities, bandPrice, history }) => (
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
            <Text fontSize="18px" color={colors.text.normal} fontWeight="500">
              ALL COMMUNITIES
            </Text>
            <Flex flexWrap="wrap" mt={3} mx="-20px" justifyContent="flex-start">
              {communities.map((community, i) => (
                <MegaCommunityCard
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
