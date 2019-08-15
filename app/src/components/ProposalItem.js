import React from 'react'
import styled from 'styled-components'
import colors from 'ui/colors'
import { Box, Flex, Text } from 'rebass'

const ProposalHeader = styled(Flex)`
  line-height: 50px;
  border-radius: 4px;
  border: solid 1px #e7ecff;
`
export default class ProposalItem extends React.Component {
  state = {
    isOpen: false,
  }

  render() {
    const { prefix, title, isExpire, expiryDate } = this.props
    return (
      <Box>
        <ProposalHeader bg="#e7ecff" pl={4} pr={3}>
          <Text color={colors.blue.normal} fontSize={1}>
            #{prefix}
          </Text>
          <Text color={colors.text.normal} fontSize={1} ml={3}>
            {title}
          </Text>
          <Flex flex={1} />
          <Text color={colors.blue.normal} fontSize={1}>
            Expiry date:
          </Text>
          <Text color={colors.text.normal} fontSize={1} ml={2}>
            {expiryDate}
          </Text>
        </ProposalHeader>
      </Box>
    )
  }
}
