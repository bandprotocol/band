import React from 'react'
import { Flex, Text } from 'ui/common'
import colors from 'ui/colors'

export default ({ isResult, percent, minimum, ...others }) => {
  return (
    <Flex flexDirection="column" {...others}>
      <Flex flexDirection="row" justifyContent="center" alignItems="center">
        <Flex flexDirection="column">
          <Flex
            width="200px"
            flexDirection="row"
            style={{
              height: '20px',
              position: 'relative',
            }}
          >
            <Flex
              style={{
                position: 'absolute',
                height: '20px',
                width: minimum + '%',
                top: '15px',
                zIndex: '1',
                borderRight: '1px dashed black',
              }}
            />
            <Flex width={!isResult ? percent / 100 : 100}>
              <Text
                weight="light"
                fontSize={0}
                color={!isResult ? colors.purple.normal : '#ec6363'}
              >
                {isResult && percent + '%'}
              </Text>
            </Flex>
            <Flex
              width={!isResult ? (100 - percent) / 100 : 100}
              justifyContent="flex-end"
            >
              <Text
                weight="light"
                fontSize={0}
                color={!isResult ? colors.purple.normal : '#42c47f'}
              >
                {isResult ? 100 - percent : percent}%
              </Text>
            </Flex>
          </Flex>
          <Flex
            width="200px"
            bg={!isResult ? '#d6dbe5' : '#42c47f'}
            flexDirection="row"
            style={{
              height: '10px',
              borderRadius: '2px',
              position: 'relative',
            }}
          >
            <Flex
              width={percent / 100}
              bg={!isResult ? colors.purple.normal : '#ec6363'}
              style={{ height: '10px', borderRadius: '2px' }}
            />
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  )
}
