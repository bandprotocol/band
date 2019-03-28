import React from 'react'
import { colors } from 'ui'
import { Flex, Text, Image, Box, AbsoluteLink, Card } from 'ui/common'
import graphYellow from 'images/graphYellow.svg'

export default ({ title, value, unit, valueUsd, graphSrc }) => (
  <Flex
    style={{
      height: '140px',
      borderRadius: '10px',
      backgroundSize: 'cover',
      backgroundPosition: 'bottom',
      backgroundImage: `url(${graphSrc || graphYellow})`,
    }}
    flexDirection="column"
    bg="white"
    width={1}
    p="20px"
  >
    <Flex flexDirection="row">
      <Flex flex={1}>
        <Text fontSize="12px">{title}</Text>
      </Flex>
      <Flex flex={1} justifyContent="flex-end">
        <Text fontSize="12px" color="#42c47f">
          +5.32%
        </Text>
      </Flex>
    </Flex>
    <Flex mt="5px">
      <Text
        fontSize="22px"
        letterSpacing="0.2px"
        fontWeight={500}
      >{`${value} ${unit}`}</Text>
    </Flex>
    <Flex flexDirection="row" mt="3px">
      <Flex flex={1}>
        <Text fontSize="12px">{valueUsd && `${valueUsd} USD`}</Text>
      </Flex>
    </Flex>
  </Flex>
)
