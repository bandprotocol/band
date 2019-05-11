import React from 'react'
import styled from 'styled-components'
import { Card, Box, Flex, Text } from 'ui/common'
import TxHashLink from 'components/TxHashLink'

const Field = ({ label, children }) => (
  <Flex my={2} style={{ lineHeight: '24px' }}>
    <Text
      fontSize="14px"
      fontWeight="500"
      color="#6976b7"
      textAlign="right"
      style={{ width: 110 }}
      mr={2}
    >
      {label}:
    </Text>
    <Text fontSize="14px">{children}</Text>
  </Flex>
)

const Address = styled(Text).attrs(() => ({
  fontFamily: 'code',
}))`
  max-width: 160px;
  overflow: hidden;
  text-overflow: ellipsis;
  whitespace: nowrap;
`

export default ({
  name,
  banner,
  link,
  organization,
  description,
  address,
  tokenAddr,
}) => (
  <Card variant="dashboard">
    <Flex>
      <Box mr={3}>
        <Text fontSize="15px" mt="12px" mb={3} fontWeight="900" color="#393939">
          DATASET INFORMATION
        </Text>
        <Description>{description}</Description>
      </Box>

      <Box
        ml="auto"
        flex="0 0 260px"
        alignSelf="center"
        style={{ borderLeft: 'solid 1px #f2f4f9' }}
      >
        <Field label="Website">{new URL(link).hostname}</Field>
        <Field label="Organization">{organization}</Field>
        <Field label="Core Contract">
          <Address>{address}</Address>
        </Field>
        <Field label="ERC-20">
          <Address>{tokenAddr}</Address>
        </Field>
      </Box>
      <Box
        ml={4}
        mr="-14px"
        flex="0 0 350px"
        style={{
          backgroundImage: `url(${banner})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          width: '350px',
          height: '150px',
          borderRadius: '6px',
        }}
      />
    </Flex>
  </Card>
)

const Description = styled(Text)`
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  word-break: break-all;
  -webkit-line-clamp: 4;
  line-height: 1.6;
  font-size: 14px;
`
