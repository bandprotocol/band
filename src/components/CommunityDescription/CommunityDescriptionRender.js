import React from 'react'
import styled from 'styled-components'
import { Flex, Text, AbsoluteLink } from 'ui/common'

const Description = styled(Text)`
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  word-break: break-all;
  -webkit-line-clamp: 4;
  line-height: 1.64;
  font-size: 13px;
`

export default ({
  name,
  link,
  organization,
  description,
  address,
  tokenAddr,
}) => {
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
          <Description>{description}</Description>
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
          <Flex mr="10px" style={{ minWidth: 0 }}>
            <Text
              fontSize="13px"
              lineHeight={1.64}
              color="#4a4a4a"
              style={{
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
              }}
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
          <Flex mr="10px" style={{ minWidth: 0 }}>
            <Text
              fontSize="13px"
              lineHeight={1.64}
              color="#4a4a4a"
              style={{
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
              }}
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
              Token:
            </Text>
          </Flex>
          <Text
            fontSize="13px"
            lineHeight={1.64}
            style={{
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
            }}
          >
            {tokenAddr}
          </Text>
          <AbsoluteLink
            href={`https://rinkeby.etherscan.io/address/${tokenAddr}`}
          >
            <i className="fas fa-external-link-alt" />
          </AbsoluteLink>
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
