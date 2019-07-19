import React from 'react'
import { Flex, Card, Text, Image } from 'ui/common'
import GreenArrow from 'images/green-arrow.svg'
import RedArrow from 'images/red-arrow.svg'

export default ({ title, changed, value, unit, subValue }) => (
  <Card variant="dashboard" my="4px" style={{ minWidth: 260, minHeight: 110 }}>
    <Flex flexDirection="column">
      <Flex alignItems="center" justifyContent="space-between">
        <Text
          py={2}
          fontSize="14px"
          fontWeight="600"
          color="#4a4a4a"
          fontFamily="head"
        >
          {title}
        </Text>
        {changed !== undefined && (
          <Flex alignItems="center">
            <Text
              fontSize="14px"
              fontWeight="900"
              color={changed >= 0 ? '#20cb8f' : '#e95959'}
              style={{ letterSpacing: '0.16px' }}
            >
              {changed >= 0 ? '+' : ''}
              {changed.toFixed(2)}%
            </Text>
            <Image src={changed >= 0 ? GreenArrow : RedArrow} ml="5px" />
          </Flex>
        )}
      </Flex>
      <Text
        mt="8px"
        fontSize="22px"
        letterSpacing="0.1px"
        fontWeight={600}
        color="#5269ff"
      >
        {value}
        <Text
          ml={2}
          fontSize="18px"
          style={{ display: 'inline-block' }}
          color="#4a4a4a"
          fontWeight="500"
        >
          {unit}
        </Text>
      </Text>
      <Text fontSize="15px" fontWeight="500" lineHeight="2em" color="#757575">
        {subValue}
      </Text>
    </Flex>
  </Card>
)
