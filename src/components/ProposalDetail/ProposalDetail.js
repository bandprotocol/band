import React from 'react'
import styled from 'styled-components'
import { Flex, Text } from 'ui/common'
import colors from 'ui/colors'

export default ({ title, description, proposer, current, changeTo, since }) => (
  <Flex
    mt="20px"
    flexDirection="column"
    style={{ borderBottom: '1px solid #cbcfe3', minHeight: '100px' }}
  >
    <Text fontWeight="500">{title}</Text>
    <Flex mt="20px">
      <Text fontSize={14} color={colors.text.grey} lineHeight={1.43}>
        {description}
      </Text>
    </Flex>
    <Flex flexDirection="row" flex={1} my="25px">
      {proposer ? (
        <React.Fragment>
          <Flex>
            <Flex mr="10px">
              <Text fontSize={14} fontWeight="500" color={colors.purple.normal}>
                By:
              </Text>
            </Flex>
            <Flex mr="10px">
              <Text fontSize={14} fontWeight="500">
                {proposer}
              </Text>
            </Flex>
            <Flex>
              <Text fontSize={12} fontWeight="300">
                {since}
              </Text>
            </Flex>
          </Flex>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <Flex width={1 / 4}>
            <Flex mr="20px">
              <Text fontSize={14} fontWeight="500" color={colors.purple.normal}>
                Current:
              </Text>
            </Flex>
            <Flex>
              <Text fontSize={14} fontWeight="500">
                {current}
              </Text>
            </Flex>
          </Flex>
          <Flex width={1 / 4}>
            <Flex mr="20px">
              <Text fontSize={14} fontWeight="500" color={colors.purple.normal}>
                Change to:
              </Text>
            </Flex>
            <Flex>
              <Text fontSize={14} fontWeight="500">
                {changeTo}
              </Text>
            </Flex>
          </Flex>
        </React.Fragment>
      )}
    </Flex>
  </Flex>
)
