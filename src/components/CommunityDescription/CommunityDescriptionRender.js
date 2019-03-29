import React from 'react'
import { colors } from 'ui'
import { Flex, Text, Image, Box, AbsoluteLink, Card } from 'ui/common'

export default ({ name, src, link, organization, description, address }) => {
  return (
    <Flex style={{ minHeight: '180px' }} flexDirection="row">
      <Flex
        flexDirection="column"
        flex={1}
        style={{
          borderRadius: '10px',
          padding: '10px 20px',
          maxWidth: '50%',
          overflow: 'hidden',
        }}
        mr="30px"
        bg="white"
      >
        <Flex
          flexDirection="row"
          style={{ borderBottom: '1px solid #f2f4f9' }}
          py="20px"
          pl="10px"
        >
          <Flex
            mr="10px"
            style={{ minWidth: '90px' }}
            justifyContent="flex-end"
          >
            <Text color="#4e3ca9" fontSize="13px" lineHeight={1.64}>
              Community:
            </Text>
          </Flex>
          <Text
            fontSize="13px"
            lineHeight={1.64}
            style={{ wordBreak: 'break-word' }}
          >
            {name}
          </Text>
        </Flex>
        <Flex
          flexDirection="row"
          style={{ borderBottom: '1px solid #f2f4f9' }}
          py="20px"
          pl="10px"
        >
          <Flex
            mr="10px"
            style={{ minWidth: '90px' }}
            justifyContent="flex-end"
          >
            <Text color="#4e3ca9" fontSize="13px" lineHeight={1.64}>
              Organization:
            </Text>
          </Flex>
          <Text
            fontSize="13px"
            lineHeight={1.64}
            style={{ wordBreak: 'break-word' }}
          >
            {organization}
          </Text>
        </Flex>
        <Flex flexDirection="row" py="20px" pl="10px">
          <Flex
            mr="10px"
            style={{ minWidth: '90px' }}
            justifyContent="flex-end"
          >
            <Text color="#4e3ca9" fontSize="13px" lineHeight={1.64}>
              Description:
            </Text>
          </Flex>
          <Text
            fontSize="13px"
            lineHeight={1.64}
            style={{ wordBreak: 'break-word' }}
          >
            {description}
          </Text>
        </Flex>
      </Flex>
      <Flex
        flexDirection="column"
        flex={1}
        style={{
          borderRadius: '10px',
          padding: '10px 20px',
          maxWidth: '50%',
          overflow: 'hidden',
        }}
        bg="white"
      >
        <Flex
          flexDirection="row"
          style={{ borderBottom: '1px solid #f2f4f9' }}
          py="20px"
          pl="10px"
        >
          <Flex
            mr="10px"
            style={{ minWidth: '90px' }}
            justifyContent="flex-end"
          >
            <Text color="#4e3ca9" fontSize="13px" lineHeight={1.64}>
              Website:
            </Text>
          </Flex>
          <Flex mr="10px">
            <Text
              fontSize="13px"
              lineHeight={1.64}
              color="#4a4a4a"
              style={{ wordBreak: 'break-word' }}
            >
              {link}
            </Text>
          </Flex>
          <AbsoluteLink href={link}>
            <i className="fas fa-external-link-alt" />
          </AbsoluteLink>
        </Flex>
        <Flex
          flexDirection="row"
          style={{ borderBottom: '1px solid #f2f4f9' }}
          py="20px"
          pl="10px"
        >
          <Flex
            mr="10px"
            style={{ minWidth: '90px' }}
            justifyContent="flex-end"
          >
            <Text color="#4e3ca9" fontSize="13px" lineHeight={1.64}>
              Contract:
            </Text>
          </Flex>
          <Flex mr="10px">
            <Text
              fontSize="13px"
              lineHeight={1.64}
              color="#4a4a4a"
              style={{ wordBreak: 'break-word' }}
            >
              {address}
            </Text>
          </Flex>
          <AbsoluteLink
            href={`https://rinkeby.etherscan.io/address/${address}`}
          >
            <i className="fas fa-external-link-alt" />
          </AbsoluteLink>
        </Flex>
        <Flex
          flexDirection="row"
          style={{ borderBottom: '1px solid #f2f4f9' }}
          py="20px"
          pl="10px"
        >
          <Flex
            mr="10px"
            style={{ minWidth: '90px' }}
            justifyContent="flex-end"
          >
            <Text color="#4e3ca9" fontSize="13px" lineHeight={1.64}>
              Created:
            </Text>
          </Flex>
          <Text fontSize="13px" lineHeight={1.64}>
            {'20-03-2019  17:00'}
          </Text>
        </Flex>
        <Flex flexDirection="row" py="20px" pl="10px">
          <Flex
            mr="10px"
            style={{ minWidth: '90px' }}
            justifyContent="flex-end"
          >
            <Text color="#4e3ca9" fontSize="13px" lineHeight={1.64}>
              Transferable:
            </Text>
          </Flex>
          <Text fontSize="13px" lineHeight={1.64}>
            {'Yes'}
          </Text>
        </Flex>
      </Flex>
    </Flex>
  )
}
