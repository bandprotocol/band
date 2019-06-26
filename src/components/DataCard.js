import React from 'react'
import styled from 'styled-components'
import { Flex, Box, Text, Image, Button } from 'ui/common'
import magnifyingGlass from 'images/magnifyingGlass.svg'

const FlexCard = styled(Flex)`
  padding: 25px 35px;
  border-radius: 10px;
  box-shadow: 0 2px 9px 4px rgba(0, 0, 0, 0.04);
  border: solid 1px #e7ecff;
  background-color: #ffffff;
`

const Input = styled.input`
  min-height: 35px;
  min-width: calc(100% - 25px);
  border: 0px;
  font-size: 16px;
  color: #4a4a4a;

  &:placeholder {
    font-size: 16px;
    color: #b8c1dd;
  }
`

const Search = () => {
  return (
    <Flex
      alignItems="center"
      px="20px"
      style={{
        minWidth: '400px',
        minHeight: '35px',
        borderRadius: '17.5px',
        border: 'solid 1px #e7ecff',
        position: 'relative',
      }}
    >
      <Input placeholder="Search" />
      <Flex style={{ position: 'absolute', right: '20px' }}>
        <Image src={magnifyingGlass} height="80%" />
      </Flex>
    </Flex>
  )
}

export default ({ children }) => {
  return (
    <FlexCard flexDirection="column">
      <Flex flexDirection="row" alignItems="center">
        <Text
          fontSize="20px"
          fontWeight="900"
          color="#393939"
          style={{ whiteSpace: 'nowrap' }}
        >
          0 Data Soccer Matches
        </Text>
        <Flex width={1} justifyContent="flex-end">
          <Search />
        </Flex>
      </Flex>
      {children}
    </FlexCard>
  )
}
