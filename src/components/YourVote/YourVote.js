import React from 'react'
import styled from 'styled-components'
import { Flex, Text, Button } from 'ui/common'
import colors from 'ui/colors'

export default ({
  title,
  description,
  proposer,
  current,
  changeTo,
  since,
  isSupport,
  isVoted,
  isActive,
}) => {
  return (
    <Flex
      mt="20px"
      flexDirection="column"
      style={{ 'border-bottom': '1px solid #cbcfe3', 'min-height': '100px' }}
    >
      <Text fontWeight="500">Your Vote:</Text>
      <Flex flexDirection="row" flex={1} my="25px">
        <Flex mr="20px">
          <Flex mr="20px">
            <Button
              color={
                !isVoted && isActive
                  ? '#fe4949'
                  : isSupport
                  ? '#fe4949'
                  : 'white'
              }
              fontWeight="500"
              bg={
                !isVoted && isActive ? 'white' : isSupport ? 'white' : '#fe4949'
              }
              style={{
                border:
                  '1px solid' +
                  (!isVoted && isActive
                    ? '#fe4949'
                    : isSupport
                    ? '#fe4949'
                    : 'white'),
                'min-width': '135px',
                opacity: isVoted && isSupport ? '0.5' : '1',
              }}
            >
              REJECT
            </Button>
          </Flex>
        </Flex>
        <Flex>
          <Flex mr="20px">
            <Button
              color={
                !isVoted && isActive
                  ? '#42c47f'
                  : isSupport
                  ? 'white'
                  : '#42c47f'
              }
              fontWeight="500"
              bg={
                !isVoted && isActive ? 'white' : isSupport ? '#42c47f' : 'white'
              }
              style={{
                border: '1px solid' + (isSupport ? 'white' : '#42c47f'),
                'min-width': '135px',
                opacity:
                  !isVoted && isActive
                    ? '#42c47f'
                    : isVoted && isSupport
                    ? '1'
                    : '0.5',
              }}
            >
              SUPPORT
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  )
}
